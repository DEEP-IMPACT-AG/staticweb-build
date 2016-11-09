
/* ---------------------------------------------------------------------------------------------------------------------

Build Configuration
Contributors: Luan Gjokaj

--------------------------------------------------------------------------------------------------------------------- */
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var imageop = require('gulp-image-optimization');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var csswring = require('csswring');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var partialimport = require('postcss-easy-import');
var plumber = require('gulp-plumber');

gulp.task('build', ['style', 'uglify', 'copyimages', 'fonts', 'bower', 'php', 'language']);

gulp.task('images', ['copyimages', 'images']);

gulp.task('run', ['build', 'connect-sync', 'watch']);

gulp.task('default');

gulp.task('deploy', function(){
    var conn = ftp.create( {
        host:     'host.com',
        user:     'username',
        password: 'password',
        parallel: 4,
        log:      gutil.log
    });
    var globs = [
        'app/.htaccess',
        'app/index.php',
        'app/assets/**'
    ];
    return gulp.src( globs, { base: './app/', buffer: false } )
        .pipe( conn.newer( '/' ) ) // only upload newer files
        .pipe( conn.dest( '/' ) );
});

gulp.task('connect-sync', function(){
  connect.server({
        base: 'app',
        port: '8020'
    }, function (){
    browserSync({
        proxy: '127.0.0.1:8020'
    });
  });
});

gulp.task('php', function(){
  return gulp
    .src(['src/*.php'])
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

gulp.task('language', function(){
  return gulp
    .src(['src/lang/*'])
    .pipe(gulp.dest('app/lang'))
    .pipe(browserSync.stream());
});

gulp.task('bower', function(){
  return gulp
    .src('bower_components/**')
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulp.dest('app/assets/bower'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function(){
  return gulp
    .src('src/assets/fonts/**')
    .pipe(gulp.dest('app/assets/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('uglify', function(){
  return gulp.src('src/assets/js/**')
    .pipe(plumber({errorHandler: onError}))
    .pipe(uglify())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('copyimages', function(){
  return gulp
    .src('src/assets/img/**')
    .pipe(gulp.dest('app/assets/img'))
    .pipe(browserSync.stream());
});

gulp.task('images', function(cb){
    gulp.src(['src/assets/img/**'])
    .pipe(plumber({errorHandler: onError}))
    .pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true}))
    .pipe(gulp.dest('app/assets/img'))
    .pipe(browserSync.stream());
});

var onError = function (err) {
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
};

gulp.task('style', function() {
  var processors = [
    autoprefixer,
    partialimport,
    cssnext({}),
    precss,
    csswring
  ];

  return gulp.src('src/assets/style/main.css')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    gulp.watch(['src/assets/style/*.css'], ['style']);
    gulp.watch(['src/assets/js/*'], ['uglify']);
    gulp.watch(['src/assets/img/*'], ['copyimages']);
    gulp.watch(['src/assets/fonts/*'], ['fonts']);
    gulp.watch(['bower_components/*'], ['bower']);
    gulp.watch(['src/lang/*.php'], ['language']);
    gulp.watch(['src/*.php'], ['php']);
});
