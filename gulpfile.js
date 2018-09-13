/* -------------------------------------------------------------------------------------------------

Build Configuration
Contributors: Luan Gjokaj

-------------------------------------------------------------------------------------------------- */
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cachebust = require('gulp-cache-bust');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const del = require('del');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const gutil = require('gulp-util');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const modRewrite = require('connect-modrewrite');
const postcssImport = require('postcss-import');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
PostCSS Plugins
-------------------------------------------------------------------------------------------------- */
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
	cssnano({
		reduceIdents: false,
	}),
];
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Header & Footer JavaScript Boundles
-------------------------------------------------------------------------------------------------- */
const headerJS = ['src/etc/analytics.js', 'node_modules/aos/dist/aos.js'];
const footerJS = ['node_modules/jquery/dist/jquery.js', 'src/assets/js/**'];
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Development Tasks
-------------------------------------------------------------------------------------------------- */
gulp.task(
	'build-dev',
	[
		'cleanup',
		'style-dev',
		'copy-images',
		'copy-fonts',
		'header-scripts-dev',
		'footer-scripts-dev',
		'process-static-files-dev',
		'watch',
	],
	() => {
		browserSync.init({
			server: {
				baseDir: 'app',
			},
			middleware: [modRewrite(['^.([^\\.]+)$ /$1.html [L]'])],
		});
	},
);

gulp.task('default');

gulp.task('style-dev', () => {
	return gulp
		.src('src/assets/style/main.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(postcss(pluginsDev))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('header-scripts-dev', () => {
	return gulp
		.src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(concat('top.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('footer-scripts-dev', () => {
	return gulp
		.src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			}),
		)
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('process-static-files-dev', () => {
	return gulp
		.src(['src/*.html'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileinclude({
				filters: {
					prefix: '@@',
					basepath: '@file',
				},
			}),
		)
		.pipe(
			cachebust({
				type: 'timestamp',
			}),
		)
		.pipe(gulp.dest('app'));
});

gulp.task('reload-js', ['footer-scripts-dev'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('reload-images', ['copy-images'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('reload-fonts', ['copy-fonts'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('reload-files', ['process-static-files-dev'], function(done) {
	browserSync.reload();
	done();
});

gulp.task('watch', () => {
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
gulp.task(
	'build-prod',
	[
		'cleanup',
		'style-prod',
		'copy-htaccess',
		'copy-images',
		'copy-fonts',
		'header-scripts-prod',
		'footer-scripts-prod',
		'process-static-files-prod',
	],
	() => {
		gutil.beep();
		gutil.log(filesGenerated);
		gutil.log(thankYou);
	},
);

gulp.task('style-prod', () => {
	return gulp
		.src('src/assets/style/main.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(postcss(pluginsProd))
		.pipe(gulp.dest('app/assets/css'));
});

gulp.task('copy-htaccess', () => {
	return gulp
		.src('src/etc/.htaccess')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app'));
});

gulp.task('header-scripts-prod', () => {
	return gulp
		.src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('top.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('footer-scripts-prod', () => {
	return gulp
		.src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			babel({
				presets: ['@babel/env'],
			}),
		)
		.pipe(concat('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'));
});

gulp.task('process-static-files-prod', () => {
	return gulp
		.src(['src/*.html'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileinclude({
				filters: {
					prefix: '@@',
					basepath: '@file',
				},
			}),
		)
		.pipe(
			cachebust({
				type: 'timestamp',
			}),
		)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/],
			}),
		)
		.pipe(gulp.dest('app'));
});
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Shared Tasks
-------------------------------------------------------------------------------------------------- */
gulp.task('cleanup', () => {
	del.sync(['app/**']);
});

gulp.task('copy-images', () => {
	return gulp
		.src('src/assets/img/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app/assets/img'));
});

gulp.task('copy-fonts', () => {
	return gulp
		.src('src/assets/fonts/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('process-images', () => {
	return gulp
		.src('src/assets/img/**')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			imagemin([imagemin.svgo({ plugins: [{ removeViewBox: true }] })], {
				verbose: true,
			}),
		)
		.pipe(gulp.dest('app/assets/img'));
});
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Utilitie Tasks
-------------------------------------------------------------------------------------------------- */
const swb = '\x1b[44m\x1b[1mStatic Web Build\x1b[0m';
const swbUrl = '\x1b[2m - https://staticbuild.website/\x1b[0m';
const thankYou = 'Thank you for using the ' + swb + swbUrl;
const errorMsg = '\x1b[41mError\x1b[0m';
const filesGenerated =
	'Your distribution files are generated in: \x1b[1m' + __dirname + '/app/' + '\x1b[0m - ✅';

const onError = function(err) {
	gutil.beep();
	console.log(swb + ' - ' + errorMsg + ' ' + err.toString());
	this.emit('end');
};
/* -------------------------------------------------------------------------------------------------
End of all Tasks
-------------------------------------------------------------------------------------------------- */
