/*
    ESSArch is an open source archiving and digital preservation system

    ESSArch Tools for Archive (ETA)
    Copyright (C) 2005-2017 ES Solutions AB

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.

    Contact information:
    Web - http://www.essolutions.se
    Email - essarch@essolutions.se
*/

var gulp = require('gulp')
var sass = require('gulp-sass');
var ngConstant = require('gulp-ng-constant');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var license = require('gulp-header-license');
var fs = require('fs');
var argv = require('yargs').argv;
var isProduction = (argv.production === undefined) ? false : true;

var vendorFiles = [
        'scripts/bower_components/api-check/dist/api-check.js',
        'scripts/bower_components/jquery/dist/jquery.js',
        'scripts/bower_components/angular/angular.js',
        'scripts/bower_components/angular-animate/angular-animate.js',
        'scripts/bower_components/angular-messages/angular-messages.js',
        'scripts/bower_components/angular-route/angular-route.js',
        'scripts/bower_components/angular-mocks/angular-mocks.js',
        'scripts/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'scripts/bower_components/angular-tree-control/angular-tree-control.js',
        'scripts/bower_components/angular-formly/dist/formly.js',
        'scripts/bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
        'scripts/bower_components/angular-smart-table/dist/smart-table.js',
        'scripts/bower_components/angular-bootstrap-grid-tree/src/tree-grid-directive.js',
        'scripts/bower_components/angular-ui-router/release/angular-ui-router.js',
        'scripts/bower_components/angular-cookies/angular-cookies.js ',
        'scripts/bower_components/angular-permission/dist/angular-permission.js',
        'scripts/bower_components/angular-translate/angular-translate.js',
        'scripts/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        'scripts/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'scripts/bower_components/angular-sanitize/angular-sanitize.js',
        'scripts/bower_components/angular-ui-select/dist/select.js',
        'scripts/bower_components/bootstrap/dist/js/bootstrap.js',
        'scripts/bower_components/angular-moment-picker/dist/angular-moment-picker.js',
        'scripts/bower_components/angular-link-header-parser/release/angular-link-header-parser.js',
        'scripts/bower_components/lodash/lodash.js',
        'scripts/bower_components/uri-util/dist/uri-util.js',
        'scripts/bower_components/marked/lib/marked.js',
        'scripts/bower_components/angular-marked/dist/angular-marked.js',
        'node_modules/moment/min/moment-with-locales.js',
        'node_modules/angular-date-time-input/src/dateTimeInput.js',
        'node_modules/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
        'node_modules/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
    ],
    jsFiles = [
        'scripts/myApp.js', 'scripts/controllers/*.js', 'scripts/services/*.js',
        'scripts/directives/*.js', 'scripts/configs/*.js'
    ],
    jsDest = 'scripts',
    cssFiles = [
        'styles/modules/index.scss',
        'styles/modules/login.scss',
        'styles/modules/my_page.scss',
        'styles/modules/receive_sip.scss',
        'styles/styles.scss'
    ],
    cssDest = 'styles';

var licenseString = fs.readFileSync('license.txt');
var buildScripts = function() {
    return gulp.src(jsFiles)
        .pipe(plumber(function(error) {
          // output an error message

          gutil.log(gutil.colors.red('error (' + error.plugin + '): ' + error.message));
          // emit the end event, to properly end the task
          this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(concat('scripts.min.js'))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(license('/*\n'+licenseString+'\n*/\n'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDest));
};

var buildVendors = function() {
    return gulp.src(vendorFiles)
        .pipe(plumber(function(error) {
          // output an error message

          gutil.log(gutil.colors.red('error (' + error.plugin + '): ' + error.message));
          // emit the end event, to properly end the task
          this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(concat('vendors.min.js'))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsDest));
};
var compileSass = function() {
 return gulp.src('styles/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(cleanCSS({
      cleanupCharsets: true, // controls `@charset` moving to the front of a stylesheet; defaults to `true`
      normalizeUrls: true, // controls URL normalization; defaults to `true`
      optimizeBackground: true, // controls `background` property optimizatons; defaults to `true`
      optimizeBorderRadius: true, // controls `border-radius` property optimizatons; defaults to `true`
      optimizeFilter: true, // controls `filter` property optimizatons; defaults to `true`
      optimizeFont: true, // ontrols `font` property optimizatons; defaults to `true`
      optimizeFontWeight: true, // controls `font-weight` property optimizatons; defaults to `true`
      optimizeOutline: true, // controls `outline` property optimizatons; defaults to `true`
      removeNegativePaddings: true, // controls removing negative paddings; defaults to `true`
      removeQuotes: true, // controls removing quotes when unnecessary; defaults to `true`
      removeWhitespace: true, // controls removing unused whitespace; defaults to `true`
      replaceMultipleZeros: true, // contols removing redundant zeros; defaults to `true`
      replaceTimeUnits: true, // controls replacing time units with shorter values; defaults to `true`
      replaceZeroUnits: true, // controls replacing zero values with units; defaults to `true`
      roundingPrecision: false, // rounds pixel values to `N` decimal places; `false` disables rounding; defaults to `false`
      selectorsSortingMethod: 'standard', // denotes selector sorting method; can be `natural` or `standard`; defaults to `standard`
      keepSpecialComments: 0, // denotes a number of /*! ... */ comments preserved; defaults to `all`
      tidyAtRules: true, // controls at-rules (e.g. `@charset`, `@import`) optimizing; defaults to `true`
      tidyBlockScopes: true, // controls block scopes (e.g. `@media`) optimizing; defaults to `true`
      tidySelectors: true, // controls selectors optimizing; defaults to `true`,
      transform: function () {} // defines a callback for fine-grained property optimization; defaults to no-op
    }))
    .pipe(sourcemaps.write('./styles.css.map'))
    .pipe(gulp.dest('styles'));
};
var copyIcons = function() {
    return gulp.src('scripts/bower_components/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('fonts')); 
};
var copyImages = function() {
    return gulp.src('scripts/bower_components/angular-tree-control/images/**.*') 
        .pipe(gulp.dest('images')); 
};
var configConstants = function() {
    var myConfig = require('./scripts/configs/config.json');
    if(isProduction) {
        var envConfig = myConfig["production"];
    } else {
        var envConfig = myConfig["development"];
    }
    return ngConstant({
        name: 'myApp.config',
        constants: envConfig,
        stream: true
    })
    .pipe(rename('myApp.config.js'))
    .pipe(gulp.dest('./scripts/configs'));
};
gulp.task('default', function() {
    configConstants(),
    buildScripts(),
    buildVendors(),
    compileSass(),
    copyIcons(),
    copyImages()
});
gulp.task('icons', copyIcons);
gulp.task('images', copyImages);
gulp.task('scripts', buildScripts);
gulp.task('vendors', buildVendors);
gulp.task('sass', compileSass);
gulp.task('config', configConstants);

gulp.task('watch', function(){
    gulp.watch(jsFiles, ['scripts']);
    gulp.watch(vendorFiles, ['vendors']);
    gulp.watch(cssFiles, ['sass']);
})
