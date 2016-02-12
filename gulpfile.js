var gulp = require('gulp');

gulp.task('copySource', function () {
  return gulp
    .src(['./css/**/*',
      './font/**/*',
      './js/**/*',
      './templates/**/*',
      './node_modules/**/*',
      './*',
      '!./contributors.txt',
      '!./gulpfile.js'
    ], {
      base: './'
    })
    .pipe(gulp.dest('./build/'))
});

gulp.task('copyLibrary', function () {
  return gulp
    .src(['./nwjs-v0.12.3-win-x64/**/*'])
    .pipe(gulp.dest('./build/'))
});

gulp.task('build', ['copySource', 'copyLibrary'], function () {});
gulp.task('default', ['build'], function () {});