# Static Web Build [![dependencies Status](https://david-dm.org/DEEP-IMPACT-AG/staticweb-build/status.svg)](https://david-dm.org/DEEP-IMPACT-AG/staticweb-build)
A simple workflow for static websites with live-reload local server, Babel transpiler for JavaScript and bundling CSS with PostCSS and postcss-preset-env.

🌍 https://staticbuild.website/

___

# Features ⚡️
* Processing styles using [PostCSS](https://postcss.org/) with [postcss-preset-env](https://preset-env.cssdb.org/)
* Babel transpiler for JavaScript (ES6)
* JavaScript concatenating and minification
* CSS minification
* HTML minification
* Image compression
* Assets copying
* Templating & partial HTML injection
* Cache-busting
* Local development server
* Live-reload for the development environment
* Distribution files: `build/`.

___

# Setup ⚙️
This project requires node version 7.5+. This is the only global dependency.
* NodeJS http://nodejs.org/

## Installation ⏳
* Clone Repository: https://github.com/DEEP-IMPACT-AG/staticweb-build
* Install node packages:
```
$ npm install
```

# Development 👾
To start the development server just run the `dev` task:
```
$ npm run dev
```
This will start the development server. The server is based on **browserSync**, supports live reloading which enables hot swapping of CSS styles without reloading the page.

### Have fun ✌️
![Terminal](http://i.imgur.com/6s4DUqT.png)

# Templating ✍️
To avoid repetitive **HTML** code the build uses [gulp-file-include](https://github.com/coderhaoxin/gulp-file-include), it allow us to re-use chunks of code written in separate files. It is recommended to place the included files in the `/src/includes` directory to keep track of changes and live-reload.

**Simple Include**
```
@@include(‘./includes/header.html')
```

**Include with Parameters**
```javascript
@@include('./includes/helmet.html', {
	"title": "Static Web Build"
})
```

`/includes/helmet.html`
```html
<title>@@title</title>
```

**If Statement**
```javascript
@@include(‘./includes/header.html’{
	"menu": true
});
```

`/includes/header.html`
```html
<article>
	<h1>@@title</h1>
	@@text
</article>
```

**Loop**
```html
<body>
	@@loop(‘./includes/loop-article.html’, [
		{ "title": "My post title", "text": "<p>lorem ipsum...</p>" },
		{ "title": "Another post", "text": "<p>lorem ipsum...</p>" },
		{ "title": "One more post", "text": "<p>lorem ipsum...</p>" }
	])
</body>
```

`/includes/loop-article.html`
```html
<article>
	<h1>@@title</h1>
	@@text
</article>
```

## File Structure 🏗
    
    ├── build/                   # Build files
    ├── dist/                    # Distribution files
    ├── src/                     # Source files
    │   ├── assets/              # Assets directory
    │       ├── css/             # CSS files
    │       ├── fonts/           # Fonts directory
    │       ├── img/             # Image directory
    │       ├── js/              # JavaScript files
    │   ├── etc/                 # Additional build files
    │   ├── includes/            # Included partials
    ├── tools/                   # Tools and utilities
    │   ├── stylelintrc.json     # Stylelint configuration file
    │   ├── IntelliJ.xml         # IntelliJ code style
    └── .babelrc                 # Babel configuration
    └── .gitignore               # Git ignored files
    └── gulpfile.js              # Gulp configuration
    └── LICENSE                  # License agreements
    └── package.json             # Node packages
    └── README.md                # You are reading this

**Note:**  Your project files: `src/`
___

# Production 🎬
To build the production files run the `prod` task:
```
$ npm run prod
```
The files will be generated in the `app/` directory. The production build automatically minifies the html and css. By default also the javascript files are concatenated in one bundle: `assets/js/bundle.js`.

# Gulpfile.js
**Note:** The `Gulpfile.js` requires a build restart for any changes to take effect.

### PostCSS Plugins 🎨
Currently, [PostCSS](http://postcss.org/) has more than 200 plugins. You can find all of the plugins in the [plugins list] or in the [searchable catalog]. [ostcss-preset-env
](https://preset-env.cssdb.org/) is installed in the default configuration.

[searchable catalog]: http://postcss.parts
[plugins list]:       https://github.com/postcss/postcss/blob/master/docs/plugins.md

```javascript
/* -------------------------------------------------------------------------------------------------
PostCSS Plugins
------------------------------------------------------------------------------------------------- */
const pluginsDev = [
	postcssImport,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
];
const pluginsProd = [
	postcssImport,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
	require('cssnano')({
		preset: [
			'default',
			{
				discardComments: true,
			},
		],
	}),
];
//--------------------------------------------------------------------------------------------------
```

## JavaScript Files ⚒
JavaScript files located in the project source directory `src/assets/js/` and are automatically concatenated and included in the build process. However you can add additional / external JavaScript libraries by including the files in the Gulp configuration.

```javascript
/* -------------------------------------------------------------------------------------------------
    Your JavaScript Files
------------------------------------------------------------------------------------------------- */
const headerJS = [
	'./src/etc/analytics.js',
	'./node_modules/aos/dist/aos.js'
];
const footerJS = [
	'./node_modules/jquery/dist/jquery.js',
	'./src/assets/js/**'
];
//--------------------------------------------------------------------------------------------------
```

The `headerJS` is included **before** the **DOM** is loaded and it does not use Babel for transpiling JavaScript. The `footerJS` is included **after** the **DOM** is loaded, and it goes thourgh Babel.

___

### Technologies 🚀
* NodeJS
* Gulp
* browserSync
* Babel
* PostCSS
* postcss-preset-env

___

# Codestyle and Quality Assurance ⚔️
The static web build repository comes with its own set of code style rules that can be imported into IntelliJ. The codestyle file can be found here: `tools/IntelliJ.xml`

It is advised to run the command `$ npm run lint:css` before pushing changes, to make sure the codestyle is consistent!

# License ⚖️
MIT

# Changelog
**v0.0.7**
- Improve cache busting - switched to gulp-rev-all

**v0.0.5**
- Added support for static server using Express.
- Switched from postcss-cssnext to postcss-preset-env.

**v0.0.4**
- Fix IE animation keyframe minification.

**v0.0.3**
- Update dependencies.
- Code legibility.

**v0.0.2**
- HTML Templating with `gulp-include`.
- Bugfixes & speed improvements.

**v0.0.1**
- Initializing Static Web Build.
