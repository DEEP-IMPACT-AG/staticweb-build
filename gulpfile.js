/* -------------------------------------------------------------------------------------------------

Build Configuration
Contributors: Luan Gjokaj

-------------------------------------------------------------------------------------------------- */
'use strict';
var babel = require("gulp-babel");
var browserSync = require('browser-sync').create();
var cachebust = require('gulp-cache-bust');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var del = require('del');
var fileinclude = require('gulp-file-include');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var modRewrite = require('connect-modrewrite');
var partialimport = require('postcss-easy-import');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
PostCSS Plugins
-------------------------------------------------------------------------------------------------- */
var pluginsDev = [
	partialimport,
	cssnext()
];
var pluginsProd = [
	partialimport,
	cssnext({warnForDuplicates: false}),
	cssnano()
];
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Header & Footer JavaScript Boundles
-------------------------------------------------------------------------------------------------- */
var headerJS = [
	'src/etc/analytics.js',
	'node_modules/aos/dist/aos.js'
];
var footerJS = [
	'node_modules/jquery/dist/jquery.js',
	'src/assets/js/**'
];
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Development Tasks
-------------------------------------------------------------------------------------------------- */
gulp.task('build-dev', [
	'cleanup',
	'style-dev',
	'copy-images',
	'copy-fonts',
	'header-scripts-dev',
	'footer-scripts-dev',
	'process-static-files-dev',
	'watch'
], function () {
	browserSync.init({
		server: {
			baseDir: "app"
		},
		middleware: [
			modRewrite([
				'^.([^\\.]+)$ /$1.html [L]'
			])
		]
	});
});

gulp.task('default');

gulp.task('style-dev', function () {
	return gulp.src('src/assets/style/main.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(postcss(pluginsDev))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('header-scripts-dev', function () {
	return gulp.src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(concat('top.js'))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('footer-scripts-dev', function () {
	return gulp.src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('process-static-files-dev', function () {
	return gulp.src(['src/*.html'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(fileinclude({
			filters: {
				prefix: '@@',
				basepath: '@file'
			}
		}))
		.pipe(cachebust({
			type: 'timestamp'
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('reload-js', ['footer-scripts-dev'], function (done) {
	browserSync.reload();
	done();
});

gulp.task('reload-images', ['copy-images'], function (done) {
	browserSync.reload();
	done();
});

gulp.task('reload-fonts', ['copy-fonts'], function (done) {
	browserSync.reload();
	done();
});

gulp.task('reload-files', ['process-static-files-dev'], function (done) {
	browserSync.reload();
	done();
});

gulp.task('watch', function () {
	gulp.watch(['src/assets/style/**/*.css'], ['style-dev']);
	gulp.watch(['src/assets/js/**'], ['reload-js']);
	gulp.watch(['src/assets/img/**'], ['reload-images']);
	gulp.watch(['src/assets/fonts/**'], ['reload-fonts']);
	gulp.watch(['src/*.html', 'src/includes/**'], ['reload-files']);
});
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Production Tasks
-------------------------------------------------------------------------------------------------- */
gulp.task('build-prod', [
	'cleanup',
	'style-prod',
	'copy-htaccess',
	'copy-images',
	'copy-fonts',
	'header-scripts-prod',
	'footer-scripts-prod',
	'process-static-files-prod'
], function () {
	gutil.beep();
	gutil.log(filesGenerated);
	gutil.log(thankYou);
});

gulp.task('style-prod', function () {
	return gulp.src('src/assets/style/main.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(postcss(pluginsProd))
		.pipe(gulp.dest('app/assets/css'));
});

gulp.task('copy-htaccess', function () {
	return gulp.src('src/etc/.htaccess')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app'));
});

gulp.task('header-scripts-prod', function () {
	return gulp.src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('top.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('footer-scripts-prod', function () {
	return gulp.src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('process-static-files-prod', function () {
	return gulp.src(['src/*.html'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(fileinclude({
			filters: {
				prefix: '@@',
				basepath: '@file'
			}
		}))
		.pipe(cachebust({
			type: 'timestamp'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/]
		}))
		.pipe(gulp.dest('app'));
});
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Shared Tasks
-------------------------------------------------------------------------------------------------- */
gulp.task('cleanup', function () {
	del.sync(['app/**']);
});

gulp.task('copy-images', function () {
	return gulp.src('src/assets/img/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app/assets/img'));
});

gulp.task('copy-fonts', function () {
	return gulp.src('src/assets/fonts/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('process-images', function () {
	return gulp.src('src/assets/img/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(imagemin([
			imagemin.svgo({ plugins: [{ removeViewBox: true }] })
		], {
			verbose: true
		}))
		.pipe(gulp.dest('app/assets/img'));
});
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Utilitie Tasks
-------------------------------------------------------------------------------------------------- */
var swb = '\x1b[44m\x1b[1mStatic Web Build\x1b[0m';
var swbUrl = '\x1b[2m - https://staticbuild.website/\x1b[0m';
var thankYou = 'Thank you for using the' + swb + swbUrl;
var errorMsg = '\x1b[41mError\x1b[0m';
var filesGenerated = 'Your distribution files are generated in: \x1b[1m' + __dirname + '/app/' + '\x1b[0m - ✅';

var onError = function (err) {
	gutil.beep();
	console.log(swb + ' - ' + errorMsg + ' ' + err.toString());
	this.emit('end');
};
/* -------------------------------------------------------------------------------------------------
End of all Tasks
-------------------------------------------------------------------------------------------------- */
