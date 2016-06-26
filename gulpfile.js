/* ---------------------------------------------------------------------------------------------------------------------

MAIN GULP CONFIGURATION
Contributors: Luan Gjokaj

--------------------------------------------------------------------------------------------------------------------- */
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var sass = require('gulp-sass');
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imageop = require('gulp-image-optimization');

gulp.task('build', ['sass', 'uglify', 'copyimages', 'fonts', 'bower', 'php']);

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
    .src(['src/*.php', 'src/.htaccess'])
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
});

gulp.task('bower', function(){
  return gulp
    .src('bower_components/**')
    .pipe(gulp.dest('app/assets/bower'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function(){
  return gulp
    .src('src/assets/fonts/**')
    .pipe(gulp.dest('app/assets/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function(){
  return gulp.src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({keepSpecialComments: 1, processImport: true}))
    .pipe(gulp.dest('app/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('uglify', function(){
  return gulp.src('src/assets/js/**')
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
    gulp.src(['src/assets/img/**']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('app/assets/img')).on('end', cb).on('error', cb)
    .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    gulp.watch(['src/scss/*.scss'], ['sass']);
    gulp.watch(['src/assets/js/**'], ['uglify']);
    gulp.watch(['src/assets/img/**'], ['copyimages']);
    gulp.watch(['src/assets/fonts/**'], ['fonts']);
    gulp.watch(['bower_components/**'], ['bower']);
    gulp.watch(['src/.htaccess'], ['php']);
    gulp.watch(['src/*.php'], ['php']);
});
