var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'); // for non blocking errors

gulp.task('scripts', function() {
    gulp.src('./main.js')
        .pipe(plumber())
        .pipe(browserify({
    		insertGlobals : true
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
    gulp.src('./style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./'));
});

gulp.task("default", function() {

	gulp.start(["scripts", "styles"]);
    gulp.watch("main.js", ["scripts"]);
    gulp.watch("./modules/*.js", ["scripts"]);
	gulp.watch("style.scss", ["styles"]);

});

