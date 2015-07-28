/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
var license = require('gulp-license');
var minifycss = require('gulp-minify-css');
var path = require('path');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var vulcanize = require('gulp-vulcanize');

var PATHS = {
  elements: {
    src: ['src/elements/**/*'],
    dest: 'dist/elements'
  },
  bower: {
    src: ['bower.json'],
    dest: 'dist/bower_components'
  },
  static: {
    src: ['src/*.*'],
    dest: 'dist'
  },
  third_party: {
    src: ['src/third_party/**/*'],
    dest: 'dist/third_party'
  },
  styles: {
    src: ['./src/styles/*.scss'],
    dest: 'dist/styles'
  }
};

/** Clean */
gulp.task('clean:bower', function(done) {
  del(PATHS.bower.dest, done);
});

gulp.task('clean:elements', function(done) {
  del(PATHS.elements.dest, done);
});

gulp.task('clean:static', function(done) {
  del(['dist/*.*'], done);
});

gulp.task('clean:third_party', function(done) {
  del(PATHS.third_party.dest, done);
});

/** Copy */
gulp.task('bower', function() {
  return bower({ cmd: 'update'});
});

gulp.task('elements', function() {
  return gulp.src(PATHS.elements.src).pipe(gulp.dest(PATHS.elements.dest));
});

gulp.task('static', function() {
  return gulp.src(PATHS.static.src).pipe(gulp.dest(PATHS.static.dest));
});

gulp.task('third_party', function() {
  return gulp.src(PATHS.third_party.src).pipe(gulp.dest(PATHS.third_party.dest));
});

/** Build */
gulp.task('styles', function() {
 return gulp.src(PATHS.styles.src)
     .pipe(sass())
     .pipe(minifycss())
     .pipe(license('Apache', {
       organization: 'Google Inc. All rights reserved.'
     }))
     .pipe(gulp.dest(PATHS.styles.dest));
});

gulp.task('vulcanize', function() {
 return gulp.src('./dist/elements/elements.html')
   .pipe(vulcanize({
     inlineScripts: true,
     inlineCss: true,
     stripExcludes: false,
     excludes: [path.resolve('./dist/bower_components/polymer/polymer.html')]
   }))
   .pipe(gulp.dest('./dist/elements'));
});

/** Watch */
gulp.task('watch', function() {
  gulp.watch(PATHS.elements.src, ['elements']);
  gulp.watch(PATHS.static.src, ['static']);
  gulp.watch(PATHS.third_party.src, ['third_party']);
  gulp.watch(PATHS.bower.src, ['bower']);
  gulp.watch(PATHS.styles.src, ['styles']);
  gulp.watch([PATHS.elements.dest, PATHS.bower.dest], ['vulcanize']);
});

gulp.task('default', function() {
  runSequence(['clean:elements', 'clean:third_party', 'clean:static'], ['third_party', 'static', 'elements', 'bower', 'styles'], 'vulcanize', 'watch');
});
