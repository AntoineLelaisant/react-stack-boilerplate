const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const watch = require('gulp-watch');

gulp.task('css', () => gulp
  .src('./assets/scss/src/main.scss')
  .pipe(sass())
  .pipe(rename('app.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./assets/scss/dist'))
);

gulp.task('watch:css', () => watch(['./assets/scss/src/**'], gulp.series('css')));

gulp.task('default', gulp.series('css'));
gulp.task('watch', gulp.series('default', 'watch:css'));
