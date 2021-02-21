const sass = require("sass");
const fs = require("fs");
const { relative } = require("path");
async function sassProcess(data, config) {
  return sass.renderSync({ ...config, data });
}

module.exports = function ({ alias }, sassConfig) {
  /* function anotherAliasToRelative(content,aliases){
 return content.split("\n").map(condidate => {
   let relativeImport=condidate;
   if(condidate.match(/(@import|@use)/g)){
Object.entries(aliases).forEach(([alias,aliasPath]) => {
const regex=new RegExp(`((?<=')${alias}+(?=\/.*'))`,"g");
if(condidate.match(regex)){
relativeImport=condidate.replace(regex,aliasPath);
return;}
});}

return relativeImport;
}).join("\n");
} */

  function aliasImportsToRelative(content, aliases, prefix = "") {
    const regex = new RegExp(
      `((?<=')${prefix}[^\//*?|<>:\n; "]+(?=\/.*';)+)`,
      "g"
    );
    return content
      .split("\n")
      .map((line) => {
        if (line.match(/(@import|@use)/g)) {
          [method, AliasImport] = line.split(" ");
          [target] = AliasImport.match(regex) || [-1];
          aliasPath = aliases[target];
          relativeImport = aliasPath
            ? AliasImport.replace(regex, aliasPath)
            : AliasImport;
          return `${method} ${relativeImport}`;
        } else return line;
      })
      .join("\n");
  }
  const importedByMap = new Map();
  function addImportsToMap(filePath, sassImport) {
    const importedBy = importedByMap.get(sassImport);
    if (importedBy) {
      importedBy.add(filePath);
    } else {
      importedByMap.set(sassImport, new Set([filePath]));
    }
  }
  return {
    name: "snowpack-sass-compiler",
    resolve: {
      input: [".scss", ".sass"],
      output: [".css"],
    },
    /**
     * If any files imported the given file path, mark them as changed.
     * @private
     */
    _markImportersAsChanged(filePath) {
      if (importedByMap.has(filePath)) {
        const importedBy = importedByMap.get(filePath);
        importedByMap.delete(filePath);
        for (const importerFilePath of importedBy) {
          this.markChanged(importerFilePath);
        }
      }
    },

    onChange({ filePath }) {
      // check exact: "_index.scss" (/a/b/c/foo/_index.scss)
      this._markImportersAsChanged(filePath);
    },
    async load({ filePath, isDev }) {
      const data = aliasImportsToRelative(
        fs.readFileSync(filePath, "utf-8"),
        alias
      );
      const result = await sassProcess(data, sassConfig);
      if (isDev) {
        const sassImports = result.stats.includedFiles;
        sassImports.forEach(
          (imp) => imp !== filePath && addImportsToMap(filePath, imp)
        );
      }
      return result.css.toString();
    },
  };
};
