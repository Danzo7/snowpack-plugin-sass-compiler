# snowpack-sass-compiler
Snowpack plugin to add the support for [Sass](https://sass-lang.com/). this plugin will compile all `*.scss` or `*.sass` files in your project directory to CSS..

#### A Note on Sass Implementations

Sass is interesting in that multiple compilers are available: [sass](https://www.npmjs.com/package/sass) (written in Dart) & [node-sass](https://www.npmjs.com/package/node-sass) (written in JavaScript). Both packages run on Node.js and both are popular on npm. However, [node-sass is now considered deprecated](https://github.com/sass/node-sass/issues/2952).

**This plugin was designed to work with the `sass` package.** `sass` is automatically installed with this plugin as a direct dependency, so no extra effort is required on your part.

## Usage

```bash
npm i snowpack-sass-compiler --save-dev
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
| `includePaths` | `String[]` | This array of strings option provides [load paths](https://sass-lang.com/documentation/at-rules/import#load-paths) for Sass to look for imports. Earlier load paths will take precedence over later ones.same as using in `compilerOptions`|
| `useAlias ` | `Boolean` | This determine whather you using path aliases or not `Default:false`.set it to true to be able to use aliases.|
| `aliasPrefix ` | `String` | this will tell the plugin what prefix you use for the aliases if you have one `Default:none`. It's optional but for optimization purposes determine a prefix is recommended.  example: `alias=@style -> aliasPrefix="@"`|
| `compilerOptions` | `{object}` | This will give you the access to all Sass [compiler options](https://sass-lang.com/documentation/js-api#options). |
> Note: `compilerOptions` does not support `sourceMap` yet.
## Alias
You  can use alias path by adding your snowpack configuration file `snowpack.config.js`

```
module.exports = {
  plugins: [
  [
      'snowpack-sass-compiler',
      {
        useAlias:true,
        aliasPrefix:"@" //could work without this
        compilerOptions: { outputStyle: 'compressed',includePaths: ['node_modules/bootstrap/dist/css'] },
      },
    ],
    ...    
  ],
  alias: {
    '@myStyles': './path/to/styles',
  },
  
  };
```
then you can use `@myStyles` in your SASS/SCSS files without having to include the relative path over and over.
`./my/other/style/example.scss`

```
@import '@myStyles/some.scss'
...
```
> Note: there is no need to use `includePaths` when using alias as its give more flexible paths that are easy to read and tracable  
