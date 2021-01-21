const sass = require('sass');
async function sassProcess(filePath, config) {
  return sass.renderSync({ ...config, file: filePath });
}

module.exports = function (_, sassConfig) {
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
    name: 'sass-preprocess',
    resolve: {
      input: ['.scss', '.sass'],
      output: ['.css'],
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
      const result = await sassProcess(filePath, sassConfig);
      // const result= sass.renderSync({ ...sassConfig, file: filePath });

      //throw new Error(filePath + '\n' + result.stats.includedFiles);

      if (isDev) {
        const sassImports = result.stats.includedFiles;
        sassImports.forEach(
          (imp) => imp !== filePath && addImportsToMap(filePath, imp),
        );
      }

      return result.css.toString();
    },
  };
};
