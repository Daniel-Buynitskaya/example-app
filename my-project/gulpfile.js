var gulp = require('gulp');
var rename=require('gulp-rename');
var sass=require('gulp-sass')(require('sass'));
var autoprefixer=require('gulp-autoprefixer');
var sourcemaps=require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');

async function css_style(done){
    gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole:true,
            outputStyle: 'compressed'
        }))
        .on('error',console.error.bind(console))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream());
    done();
}

async function print(done){
    console.log("Hi");
    done();
}

async function watchSass(){
    gulp.watch("./scss/**/*",css_style);
}

async function sync(done){
   browserSync.init({
       server:{
            baseDir:"./"
        },
        port: 3000
    });
    done();
}

async function browserReload(done) {
    browserSync.reload();
    done();
}

async function watchFiles(){
    gulp.watch("./scss/**/*",css_style);
    gulp.watch("./**/*.html",browserReload);
    gulp.watch("./**/*.php",browserReload);
    gulp.watch("./**/*.js",browserReload);
}

//exports.default=defaultSomeTask;
//exports.printHello=printHello;
gulp.task(css_style);
gulp.task(print);

//gulp.task('default',gulp.series(print,watchSass));
gulp.task('default',gulp.parallel(sync,watchFiles));
gulp.task(sync);

gulp.task('compress', async function() {
    gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/images/'))
});
