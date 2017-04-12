# Static Web Build #
A simple workflow for static websites, running a PHP web server, Babel transpiler for JavaScript and bundling CSS with PostCSS and CSSNext.

## Setup
This project requires node version 6. This is the only global dependency.
* NodeJS http://nodejs.org/

## Installation
* Clone Repository: https://github.com/luangjokaj/staticweb-build
* Install node packages:
```
$ npm install
```

## Development
To start the development server just run the `dev` task.
```
$ npm run dev
```
This will start the development server. The server is based on **browserSync**, supports hot reloading which enables hot swapping of code without reloading the page. The php server is loaded with **gulp-connect-php**.


### File Structure
    
    ├── app/                     # Distribution files
    ├── src/                     # Source files
    │   ├── assets/              # Assets directory
    │       ├── img/             # Image directory
    │       ├── fonts/           # Fonts directory
    │       ├── js/              # JavaScript files
    │       ├── styles/          # CSS files
    ├── tools/                   # Tools and utilities
    │   ├── stylelintrc.json     # Stylelint configuration file
    │   ├── IntelliJ.xml         # IntelliJ code style
    └── .babelrc                 # Babel configuration
    └── .gitignore               # Git ignored files
    └── LICENSE                  # License agreements
    └── package.json             # Node packages
    └── README.md                # You are reading this

**Note:**  Your project files: `src/
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

## Gulpfile.js
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
/* -------------------------------------------------------------------------------------------------
    Your JavaScript Files
------------------------------------------------------------------------------------------------- */
var footerJS = [
    'node_modules/jquery/dist/jquery.js',
    'src/assets/js/main.js'
];
//--------------------------------------------------------------------------------------------------
```