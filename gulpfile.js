/* -------------------------------------------------------------------------------------------------

    Build Configuration
    Contributors: Luan Gjokaj

------------------------------------------------------------------------------------------------- */
var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
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
    cssnext({}),
    cssnano()
];
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
    Your JavaScript Files
------------------------------------------------------------------------------------------------- */
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
    'footer-scripts-dev',
    'process-static-files-dev',
    'connect-sync',
    'watch'
]);

gulp.task('build-prod', [
    'style-prod',
    'copy-images',
    'copy-fonts',
    'footer-scripts-prod',
    'process-images',
    'process-static-files-prod'
]);

gulp.task('default');

gulp.task('connect-sync', function () {
    connect.server({
        base: 'app',
        port: '8020'
    }, function () {
        browserSync({
            proxy: '127.0.0.1:8020'
        });
    });
});

gulp.task('process-static-files-dev', function () {
    return gulp.src(['src/*.php', 'src/*.html'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileinclude({
            filters: {
                prefix: '@@',
                basepath: '@file'
            }
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
});

gulp.task('process-static-files-prod', function () {
    return gulp.src(['src/*.html', 'src/*.php'])
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
        .pipe(gulp.dest('app/assets/js'))
        .pipe(browserSync.stream());
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
        .pipe(gulp.dest('app/assets/js'))
});

gulp.task('copy-fonts', function () {
    return gulp.src('src/assets/fonts/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('app/assets/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('copy-images', function () {
    return gulp.src('src/assets/img/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('app/assets/img'))
        .pipe(browserSync.stream());
});

gulp.task('process-images', function (cb) {
    return gulp.src('src/assets/img/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin())
        .pipe(gulp.dest('app/assets/img'))
});

gulp.task('style-dev', function () {
    return gulp.src('src/assets/style/main.css')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.stream());
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

gulp.task('watch', function () {
    gulp.watch(['src/assets/style/*.css'], ['style-dev']);
    gulp.watch(['src/assets/js/*'], ['footer-scripts-dev']);
    gulp.watch(['src/assets/img/*'], ['copy-images']);
    gulp.watch(['src/assets/fonts/*'], ['copy-fonts']);
    gulp.watch(['src/*.php', 'src/*.html', 'src/includes/**'], ['process-static-files-dev']);
});
/* -------------------------------------------------------------------------------------------------
    End of Build Tasks
------------------------------------------------------------------------------------------------- */