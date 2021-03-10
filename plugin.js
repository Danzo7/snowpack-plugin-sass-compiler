const sass = require("sass");
const fs = require("fs");
module.exports = function ({ alias },{includePaths=[],useAlias=false,aliasPrefix="",compilerOptions={}} ) {
  function aliasImportsToRelative(content, aliases, prefix) {

    const parentDirRegex = new RegExp(
      `((?<=')${prefix}[^\//*?|<>:\n; "]+(?=\/.*';)+)`,
      "g"
    );
    //use prefix to filter regular imports from alias imports
    const isAliasRegex=new RegExp(`(@import|@use)+(?=\ '${prefix})`)
    return content
      .split("\n")
      .map((line) => {
        if (line.match(isAliasRegex)) {
          [method, AliasImport] = line.split(" ");
          [target] = AliasImport.match(parentDirRegex) || [-1];
          let aliasPath = aliases[target];
          let relativeImport = aliasPath
            ? AliasImport.replace(parentDirRegex, aliasPath)
            : AliasImport;
          return `${method} ${relativeImport}`;
        } 
        else
        return line
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
      this._markImportersAsChanged(filePath);
    },
    async load({ filePath, isDev }) {
      let data=fs.readFileSync(filePath, "utf-8");
      data =useAlias ? aliasImportsToRelative(data,alias,aliasPrefix) : data;
      if(compilerOptions["data"])
     throw new Error("Handling data are made by the plugin. You need to remove 'data' attribute");
      const result = sass.renderSync({data, includePaths,...compilerOptions});
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
