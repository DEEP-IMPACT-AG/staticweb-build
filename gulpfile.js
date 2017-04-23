/* -------------------------------------------------------------------------------------------------

    Build Configuration
    Contributors: Luan Gjokaj

------------------------------------------------------------------------------------------------- */
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var partialimport = require('postcss-easy-import');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('cssnano');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-htmlmin');
var babel = require("gulp-babel");
var fileinclude = require('gulp-file-include');
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
    PostCSS Plugins
------------------------------------------------------------------------------------------------- */
var plugins = [
    partialimport,
    cssnext({
        warnForDuplicates: false
    }),
    cssnano()
];
//--------------------------------------------------------------------------------------------------
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
/* -------------------------------------------------------------------------------------------------
    Start of Build Tasks
------------------------------------------------------------------------------------------------- */
gulp.task('build-dev', [
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
        }
    });
});

gulp.task('build-prod', [
    'style-prod',
    'copy-images',
    'copy-fonts',
    'header-scripts-prod',
    'footer-scripts-prod',
    'process-static-files-prod'
]);

gulp.task('default');

gulp.task('process-static-files-dev', function () {
    return gulp.src(['src/*.html'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileinclude({
            filters: {
                prefix: '@@',
                basepath: '@file'
            }
        }))
        .pipe(gulp.dest('app'));
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
        .pipe(htmlmin({
            collapseWhitespace: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/]
        }))
        .pipe(gulp.dest('app'));
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

/* NOTE: On header scripts babel is not executed */
gulp.task('header-scripts-dev', function () {
    return gulp.src(headerJS)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(concat('top.js'))
        .pipe(sourcemaps.write("."))
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
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('app/assets/js'));
});

/* NOTE: On header scripts babel is not executed */
gulp.task('header-scripts-prod', function () {
    return gulp.src(headerJS)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('top.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('app/assets/js'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('src/assets/fonts/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('copy-images', function () {
    return gulp.src('src/assets/img/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('app/assets/img'));
});

gulp.task('process-images', function () {
    return gulp.src('src/assets/img/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin([
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('app/assets/img'));
});

gulp.task('style-dev', function () {
    return gulp.src('src/assets/style/main.css')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('style-prod', function () {
    return gulp.src('src/assets/style/main.css')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('app/assets/css'));
});

var onError = function (err) {
    gutil.beep();
    console.log(err.toString());
    this.emit('end');
};

var reload = browserSync.reload();

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
/* -------------------------------------------------------------------------------------------------
    End of Build Tasks
------------------------------------------------------------------------------------------------- */
