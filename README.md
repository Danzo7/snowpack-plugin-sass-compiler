# snowpack-sass-compiler
Snowpack plugin to add the support for [Sass](https://sass-lang.com/). this plugin will compile all `*.scss` or `*.sass` files in your project directory to CSS..

#### A Note on Sass Implementations

Sass is interesting in that multiple compilers are available: [sass](https://www.npmjs.com/package/sass) (written in Dart) & [node-sass](https://www.npmjs.com/package/node-sass) (written in JavaScript). Both packages run on Node.js and both are popular on npm. However, [node-sass is now considered deprecated](https://github.com/sass/node-sass/issues/2952).

**This plugin was designed to work with the `sass` package.** `sass` is automatically installed with this plugin as a direct dependency, so no extra effort is required on your part.

## Usage

```bash
npm i snowpack-sass-compiler
```

Then add the plugin to your Snowpack config:

```js
// snowpack.config.js

module.exports = {
  plugins: [
    [
      'snowpack-sass-compiler',
      {
        /* see options below */
      },
    ],
  ],
};
```

## Plugin Options

| Name                |   Type    | Description                                                                                                                                                                                                                                                                              |
| :------------------ | :-------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `includePaths`            | `array` | This array of strings option provides [load paths](https://sass-lang.com/documentation/at-rules/import#load-paths) for Sass to look for imports. Earlier load paths will take precedence over later ones.|

