# Static Web Build #

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
    └── README.md

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
* PostCSS
* CSSNext