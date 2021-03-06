const gulp = require('gulp');

const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const clean = require('gulp-clean');
const vueify = require('gulp-vueify');
const browserify = require('gulp-browserify');

let srcPath = 'src/';
let distPath = 'dist/';

// Lint Task
gulp.task('lint', function() {
    return gulp.src(srcPath + 'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// index.html
gulp.task('index', function() {
    var data = gulp.src(srcPath + '*.html')
        .pipe(gulp.dest(distPath));

    var index = gulp.src(srcPath + 'data/**/*.json')
        .pipe(gulp.dest(distPath + 'data'));

    return merge(data, index);
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(srcPath + 'css/+(*.scss|*.css)')
        .pipe(sass())
        .pipe(gulp.dest(distPath + 'css'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(srcPath + 'fonts/*')
        .pipe(gulp.dest(distPath + 'fonts'))
});

//  Components
gulp.task('components', function() {
    var sources = srcPath + 'js/components/**/*.vue';

      return gulp.src(sources)
        .pipe(vueify())
        .pipe(gulp.dest(distPath + 'js/components'));

});

// Script
gulp.task('scripts', function() {
    var sources = srcPath + 'js/app.js';
    return gulp.src(sources)
        .pipe(browserify({
                insertGlobals: true
                //debug: !gulp.env.production
            }))
        //.pipe(babel({
           //presets: ['es2015']
        //}))
        // .pipe(uglify())
        .pipe(gulp.dest(distPath + 'js/'));
});

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(srcPath + '*.html', ['index']);
    gulp.watch(srcPath + 'js/*.js', ['scripts']);
    gulp.watch(srcPath + 'css/+(*.scss|*.css)', ['sass']);
});

// Default Task
gulp.task('default', ['index', 'sass', 'scripts', 'components', 'fonts', 'watch']);