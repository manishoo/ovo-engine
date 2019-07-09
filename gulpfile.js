var gulp = require('gulp')
var series = require('gulp').series
var ts = require('gulp-typescript')
var exec = require('child_process').exec


function compile(c) {
  var tsProject = ts.createProject('tsconfig.json');

  var result = tsProject.src().pipe(tsProject());

  return result.js.pipe(gulp.dest('build'));
}

function copy(c) {
  gulp.src(['src/**/*.json']).pipe(gulp.dest('build'));
  c()
}

function tspath(c) {
  exec('tscpaths -p tsconfig.json -s ./src -o ./build', function (err, stdout, stderr) {
    // console.log(stdout);
    console.error(stderr);
    c(err);
  });
}

exports.default = series(compile, copy, tspath)
