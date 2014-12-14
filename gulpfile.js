//gulp stuff i need
var pkg = require('./package.json'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    templateCache = require('gulp-angular-templatecache')

// non-gulp stuff i need
var http = require('http'),
    connect = require('connect')

var paths = {
  scripts: ['scripts/**/*.js'],
  tests: ['tests/**/*.js'],
  styles: ['styles/**/*.less'],
  views: [
    'views/**/*.html',
    'scripts/templates/**/*.html'
  ],
  concatenatedScripts: ['build/' + pkg.name + '.js']
}

var serverPort = 3000,
    buildLocation = 'build'


gulp.task('compileScripts', function () {
  gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest(buildLocation))
})

gulp.task('compressScripts', function () {
  gulp.src(paths.concatenatedScripts)
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(gulp.dest(buildLocation))
})

//compiles coffee script files
gulp.task('compileTests', function () {
  gulp.src(paths.tests)
      .pipe(plumber())
      .pipe(coffee({bare: true}))
      .pipe(gulp.dest('tests'))
})

gulp.task('compileLess', function () {
  gulp.src(paths.styles)
      .pipe(plumber())
      .pipe(less())
      .pipe(concatCss(pkg.name + '.css'))
      .pipe(gulp.dest(buildLocation))
})

gulp.task('compileViews', function () {
  gulp.src(paths.views)
      .pipe(templateCache({standalone: true}))
      .pipe(gulp.dest(buildLocation))
})

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['build'])
  gulp.watch(paths.tests, ['build'])
  gulp.watch(paths.styles, ['build'])
  gulp.watch(paths.views, ['build'])
})

// launch this repo as a server (port 3000)
gulp.task('serve', function () {
  var app = connect().use(connect.static(__dirname))

  http.createServer(app).listen(serverPort)
  console.log('server running on localhost:' + serverPort)
})

// builds everything to the build directory
gulp.task('build', ['compileScripts', 'compileViews', 'compileLess', 'compressScripts'])

// runs a build and launches a server
gulp.task('dev', ['compileScripts', 'compileViews', 'compileLess', 'watch', 'serve'])

gulp.task('default', ['dev'])
