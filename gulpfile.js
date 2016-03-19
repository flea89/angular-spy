//jshint node:true
'use strict';

var gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    connect = require('gulp-connect'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    exorcist   = require('exorcist'),
    KarmaServer = require('karma').Server,
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    runSequence = require('run-sequence'),
    js = 'src/js/**/*.js',
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version'),
    argv = require('yargs').argv,

    compileJs = function (dist) {
        var dest = dist ? 'dist' : 'example';
        return browserify('src/js/spy.js', {
                debug: true
            })
            .transform(babelify)
            .bundle()
            .on('error', function (err) {
                console.log('Error : ' + err.message);
            })
            .pipe(exorcist(dest + '/spy.js.map'))
            .pipe(source('spy.js'))
            .pipe(gulp.dest(dest));
    };

gulp.task('compilejs', function () {
    compileJs(true);
});

gulp.task('compilejs-dev', function () {
    compileJs(false);
});

gulp.task('build', function () {
    return browserify('src/js/spy.js')
        .transform(babelify)
        .bundle()
        .on('error', function (err) {
            console.log('Error : ' + err.message);
        })
        .pipe(source('spy.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('karma', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('karma-sr', function (done) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('server', function () {
    connect.server({
        root: ['example', 'bower_components']
    });
});

gulp.task('watch', function () {
    gulp.watch([js], ['compilejs-dev']);
});

gulp.task('del:dist', function (done) {
    del([
        'dist/**/*'
    ], done);
});



function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('Bumps package version'))

        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })

gulp.task('deploy', function (cb) {
    var tasks = ['del:dist', 'compilejs', 'karma-sr', 'build'];
    tasks.push(argv.type);
    tasks.push(cb)
    runSequence.apply(null, tasks);
});

gulp.task('default', ['compilejs-dev', 'server', 'watch']);
