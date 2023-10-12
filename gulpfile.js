const { src, dest, watch, series } = require('gulp');
//const { compile } = require('sass')
const sass = require('gulp-sass')(require('sass'));

compileCss = ()=>{
    return src('styles/**/*.scss') // scss source folder
    .pipe(sass()) //scss compiler
    .pipe(dest('css')) // output css after scss compilation
}

watchTask = ()=>{
    watch(['styles/**/*.scss', '*.html'], compileCss);
}

exports.default = series(compileCss, watchTask);

/*****
NB: the * symbol means all files with the .scss extention
the double ** means all subfolders containing .scss files as well

*****/