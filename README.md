# Static Web Build [![Dependencies](https://david-dm.org/luangjokaj/staticweb-build/status.svg)](https://david-dm.org/luangjokaj/staticweb-build/)
 #
A simple workflow for static websites with live-reload local server, Babel transpiler for JavaScript and bundling CSS with PostCSS and CSSNext.

___

### Features ⚡️
* Processing styles using PostCSS with CSSNext
* Babel Transpiler for JavaScript (ES16)
* JavaScript Concatenating and Minification
* CSS Minification
* HTML Minification
* Image Compression
* Asset Copying
* Templating & Partial HTML Injection
* Server for viewing built site
* Live-Reload for the dev environment
* Creates `app/` directory with built content and assets

___

# Setup ⚙️
This project requires node version 6. This is the only global dependency.
* NodeJS http://nodejs.org/

## Installation 
* Clone Repository: https://github.com/DEEP-IMPACT-AG/staticweb-build
* Install node packages:
```
$ npm install
```

## Development 
To start the development server just run the `dev` task.
```
$ npm run dev
```
This will start the development server. The server is based on **browserSync**, supports live reloading which enables hot swapping of CSS styles without reloading the page.

### Have fun ✌️
![Terminal](http://i.imgur.com/M8R604H.png)

### Templating
To avoid repetitve **HTML** code the build uses [gulp-file-include](https://github.com/coderhaoxin/gulp-file-include), it allow us to re-use chunks of code written in separate files. It is recommended to place the included files in the `src/includes` directory to keep track of changes and live-reload.

### File Structure
    
    ├── app/                     # Distribution files
    ├── src/                     # Source files
    │   ├── assets/              # Assets directory
    │       ├── img/             # Image directory
    │       ├── fonts/           # Fonts directory
    │       ├── js/              # JavaScript files
    │       ├── styles/          # CSS files
    │   ├── includes/            # Included partials
    ├── tools/                   # Tools and utilities
    │   ├── stylelintrc.json     # Stylelint configuration file
    │   ├── IntelliJ.xml         # IntelliJ code style
    └── .babelrc                 # Babel configuration
    └── .gitignore               # Git ignored files
    └── LICENSE                  # License agreements
    └── package.json             # Node packages
    └── README.md                # You are reading this

**Note:**  Your project files: `src/`
___

## Production
To build the production files run the `prod` task:
```
$ npm run prod
```
The files will be generated in the `app/` directory. The production build automatically minifies the html and css. By default also the javascript files are concatenated in one bundle: `assets/js/bundle.js`.

___

### Technologies
* NodeJS
* Gulp
* browserSync
* Babel
* PostCSS
* CSSNext

___

# Gulpfile.js
**Note:** The `Gulpfile.js` requires a build restart for any changes to take effect.

### PostCSS Plugins
Currently, PostCSS has more than 200 plugins. You can find all of the plugins in the [plugins list] or in the [searchable catalog].

[searchable catalog]: http://postcss.parts
[plugins list]:       https://github.com/postcss/postcss/blob/master/docs/plugins.md

```javascript
/* -------------------------------------------------------------------------------------------------
    PostCSS Plugins
------------------------------------------------------------------------------------------------- */
var plugins = [
    partialimport,
    cssnext({}),
    cssnano()
];
//--------------------------------------------------------------------------------------------------
```

### JavaScript Files
JavaScript files located in the project source directory `src/assets/js/` and are automatically concatenated and included in the build process. However you can add additional / external JavaScript libraries by including the files in the Gulp configuration.

```javascript
/* -------------------------------------------------------------------------------------------------
    Your JavaScript Files
------------------------------------------------------------------------------------------------- */
var headerJS = [
    'node_modules/aos/dist/aos.js'
];
var footerJS = [
    'node_modules/jquery/dist/jquery.js',
    'src/assets/js/**'
];
//--------------------------------------------------------------------------------------------------
```

The `headerJS` is included **before** the **DOM** is loaded and it does not use Babel for transpiling JavaScript. The `footerJS` is included **after** the **DOM** is loaded, and it goes thourgh Babel.

## Codestyle and Quality Assurance
The static web build repository comes with its own set of code style rules that can be imported into IntelliJ. The codestyle file can be found here: `tools/IntelliJ.xml`

It is advised to run the command `$ npm run lint:css` before pushing changes, to make sure the codestyle is consitent!

## License
MIT
