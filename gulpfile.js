'use strict';

const gulp = require('gulp');

// Are we running within continuous integration?
const CI = process.env.CI === 'true';

// File globs.
const entrypoint = require('./package.json')['main'];
const globs = {
  sources: [entrypoint, 'lib/**/*.js', 'commands/**/*.js'],
  tests: ['test/**/*.test.js'],
  testsSetup: ['./test/setup.js']
};
const all = Array.prototype.concat.apply([], Object.keys(globs).map(x => globs[x]));

// Default meta-task.
gulp.task('default', ['watch']);

// Test meta-task.
const runAllTasks = function (tasksToRun, callback) {
  let anyErrors = false;
  const runNextTask = function (result) {
    anyErrors = anyErrors || (result && result.err);
    if (tasksToRun.length) {
      gulp.start(tasksToRun.shift());
    } else {
      gulp.removeListener('task_stop', runNextTask);
      gulp.removeListener('task_err', runNextTask);
      if (anyErrors) {
        let error = new Error('One or more tasks failed.  (See above for details)');
        error.showStack = false;
        callback(error);
      } else {
        callback();
      }
    }
  };
  gulp.on('task_stop', runNextTask);
  gulp.on('task_err', runNextTask);
  runNextTask();
};

gulp.task('test', function (done) {
  runAllTasks(['semistandard-lint', 'mocha-test'], done);
});

// Watch meta-task.
const watch = require('gulp-watch');
const batch = require('gulp-batch');

gulp.task('watch', function () {
  watch(all, { ignoreInitial: false }, batch(function (events, done) {
    gulp.start('test', done);
  }));
});

// Semistandard-based linting task.
const semistandard = require('gulp-semistandard');

gulp.task('semistandard-lint', function () {
  return gulp.src(all.concat('./gulpfile.js'))
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true,
      quiet: true
    }));
});

// Mocha-based testing task.
const mocha = require('gulp-mocha');

gulp.task('mocha-test', function () {
  return gulp.src(globs.tests, { read: false })
    .pipe(mocha({
      require: globs.testsSetup,
      reporter: CI ? 'spec' : 'nyan'
    }));
});
