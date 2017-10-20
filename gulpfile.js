'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('minify-css', function () {
  return gulp.src('./app/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./app/css/min'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('./app/js/*.js'),
        uglify(),
        gulp.dest('./app/js/min')
    ],
    cb
  );
});

gulp.task('imagemin', function () {
	return gulp.src('./app/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./app/images/min'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        port: 3002,
        injectChanges: true,
        server: {
            baseDir: "./app/"
        }
    });
    
    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/css/*.css", ['minify-css']);
    gulp.watch("app/js/*.js", ['compress', 'reload']);
    gulp.watch("app/images/*", ['imagemin']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', ['sass', 'compress', 'minify-css', 'imagemin', 'browser-sync']);

gulp.task('dist', ['sass', 'compress', 'minify-css', 'imagemin'], function () {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist/'));
    gulp.src('./app/css/min/*')
        .pipe(gulp.dest('./dist/css/min/'));
    gulp.src('./app/js/min/*')
        .pipe(gulp.dest('./dist/js/min/'));
    gulp.src('./app/images/min/*')
        .pipe(gulp.dest('./dist/images/min/'));
});