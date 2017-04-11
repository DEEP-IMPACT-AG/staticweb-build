/* -------------------------------------------------------------------------------------------------

 Build Configuration
 Contributors: Luan Gjokaj

 ------------------------------------------------------------------------------------------------ */
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

gulp.task('build-dev', [
    'style-dev',
    'uglify',
    'copy-images',
    'copy-fonts',
    'footer-scripts',
    'copy-php',
    'connect-sync',
    'watch'
]);

gulp.task('build-prod', [
    'style-prod',
    'uglify',
    'copy-images',
    'process-images',
    'copy-fonts',
    'footer-scripts',
    'process-php'
]);

gulp.task('default');

var footerJS = [
    'node_modules/jquery/dist/jquery.js',
    'src/assets/js/main.js'
];

var onError = function (err) {
    gutil.beep();
    console.log(err.toString());
    this.emit('end');
};

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

gulp.task('uglify', function () {
    return gulp.src('src/assets/js/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(uglify())
        .pipe(gulp.dest('app/assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('copy-php', function () {
    return gulp
        .src(['src/*.php'])
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
});

gulp.task('process-php', function () {
    return gulp.src(['src/*.html', 'src/*.php'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/]
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('copy-fonts', function () {
    return gulp
        .src('src/assets/fonts/**')
        .pipe(gulp.dest('app/assets/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('copy-images', function () {
    return gulp
        .src('src/assets/img/**')
        .pipe(gulp.dest('app/assets/img'))
        .pipe(browserSync.stream());
});

gulp.task('process-images', function (cb) {
    return gulp
        .src('src/assets/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('app/assets/img'))
});

gulp.task('footer-scripts', function () {
    return gulp.src(footerJS)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/assets/js'))
        .pipe(browserSync.stream());
});

var plugins = [
    partialimport,
    cssnext({}),
    cssnano()
];

gulp.task('style-dev', function () {
    return gulp.src('src/assets/style/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('style-prod', function () {
    return gulp.src('src/assets/style/main.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('app/assets/css'));
});


gulp.task('watch', function () {
    gulp.watch(['src/assets/style/*.css'], ['style-dev']);
    gulp.watch(['src/assets/js/*'], ['footer-scripts']);
    gulp.watch(['src/assets/img/*'], ['copy-images']);
    gulp.watch(['src/assets/fonts/*'], ['copy-fonts']);
    gulp.watch(['src/*.php'], ['copy-php']);
});
