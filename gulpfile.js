var gulp = require('gulp');
var merge = require('merge-stream');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var clean = require('gulp-rimraf');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var templateCache = require('gulp-angular-templatecache');

var destination = 'dist';

var jsHintConfig = {
    "node": true
};

gulp.task('lint', function () {
    return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(jshint(jsHintConfig))
    .pipe(jshint.reporter('default'));
});


gulp.task('styles', function () {
    return gulp.src('./styles/main.less')
        .pipe(plumber())
        .pipe(less({
            paths: ['bower_components/bootstrap/less']
        }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(destination + '/css'));
});

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(plumber())
        .pipe(clean());
});

var environment = gulp.env.config ? gulp.env.config : "dev";

gulp.task('browserify', ['templates'], function () {
    return gulp.src('./app/app.js')
        .pipe(plumber())
        .pipe(browserify({
        insertGlobals : false,
        debug : environment === "dev",
        shim: {
            angular: {
                path: 'bower_components/angular/angular.min.js',
                exports: 'angular'
            },
            'angular-route': {
                path: 'bower_components/angular-route/angular-route.min.js',
                exports: 'ngRoute',
                depends: {
                    angular: 'angular'
                }
            },
            'angular-bootstrap': {
                path: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                exports: 'angular',
                depends: {
                    angular: 'angular'
                }
            },
            'prex-templates': {
                path: 'app/templates/templates.js',
                exports: 'angular',
                depends: {
                    angular: 'angular'
                }
            }
        }
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(destination + '/js'));
});

gulp.task('uglify', ['browserify'], function() {
    return gulp.src(destination + '/js/app.js')
                .pipe(uglify())
                .pipe(gulp.dest(destination + '/js'));
});


gulp.task('templates', function (cb) {
    return gulp.src('app/templates/**/*.html')
        .pipe(templateCache({ standalone: true, module: 'prex.templates' }))
        .pipe(gulp.dest('app/templates'));
});

gulp.task('assets', function () {
    var fonts = gulp.src('assets/fonts/**')
        .pipe(gulp.dest(destination + '/fonts'));

    var app = gulp.src('assets/app/index.html')
        .pipe(gulp.dest(destination + '/app'));
    
    var manage = gulp.src('assets/manage/index.html')
        .pipe(gulp.dest(destination + '/manage'));        

    var html = gulp.src('assets/**.html')
    .pipe(gulp.dest(destination));

    return merge(fonts, html, app, manage);
});

gulp.task('do-watch', function () {
    livereload.listen();

    gulp.watch(['app/templates/**/*.html', 'app/**/*.js', '!app/templates/templates.js'], ['browserify','lint']).on('change', livereload.changed);

    gulp.watch('styles/**/*.less', ['styles']).on('change', livereload.changed);

    gulp.watch('assets/**', ['assets']).on('change', livereload.changed);
});


gulp.task('default', ['templates', 'browserify', 'styles', 'assets', 'lint']);
gulp.task('watch', ['default', 'do-watch']);