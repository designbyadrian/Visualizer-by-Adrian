(function gulpTasks() {
    'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sassLint = require('gulp-sass-lint'),
	cleanCSS = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	neat = require('node-neat').includePaths,
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	sequence = require('gulp-sequence'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect'),
	queue = require('streamqueue'),
	paths = {
		root: 		'./app',
		js: 		'./assets/js',
		mainJS: 	'./assets/js/main.js',
		sass: 		'./assets/sass',
		mainSASS: 	'./assets/sass/main.sass'
	},
	sassVendors = [
		'./bower_components/font-awesome/scss/'
	],
	jsVendors = [
		'./bower_components/webrtc-adapter/adapter-1.0.7.js'
	];

gulp.task('default', sequence('clean', ['styles','scripts'],'webserver','watch'));

gulp.task('clean',function(){

});

gulp.task('webserver',function(){
	connect.server({
		root: paths.root,
		livereload: true
	});
});

gulp.task('watch',function(){
	gulp.watch(paths.root+"/*.html",['html']);
	gulp.watch(paths.sass+'/*.sass',['styles']);
	gulp.watch(paths.js+'/*.js',['scripts']);
});

gulp.task('html',function(){
	gulp.src(paths.root+"/*.html")
		.pipe(connect.reload());
});

gulp.task('styles', ['sass-lint', 'sass']);

gulp.task('sass-lint',function(){
	gulp
		.src(paths.mainSASS)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'Sass Lint Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sassLint({'config': 'lint.yml'}))
		.pipe(sassLint.format());
		//.pipe(sassLint.failOnError());
});

gulp.task('sass',function(){

	gulp.src(paths.mainSASS)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'Sass Compile Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			style: 'compact',
			includePaths: neat,//.concat(sassVendors),
			sourceMap: true
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS())
		.pipe(rename('style.css'))
		.pipe(gulp.dest(paths.root))
		.pipe(sourcemaps.write(paths.root))
		.pipe(gulp.dest(paths.root))
		.pipe(notify({
			message: 'SASS complete'
		}))
		.pipe(connect.reload());
});



gulp.task('scripts', ['es-lint', 'js']);

gulp.task('es-lint',function(){
	gulp.src([
			paths.mainJS,
			paths.js+'/*.js'
		],{
			base: paths.js
		})
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'JS Lint Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(eslint())
		.pipe(eslint.format())
		//.pipe(eslint.failAfterError());
});

gulp.task('js',function(){

	var concatStream = gulp.src(jsVendors),
		minStream = gulp.src([
			paths.mainJS,
			paths.js+'/*.js'
		],{
			base: paths.js
		})
		.pipe(plumber({
			errorHandler: function(err) {
				var file = err.fileName.split("/");
				file = file[file.length-1];

				console.error(err.message);

				notify.onError({
					title: 'JS Compile Error',
					message: 'Line <%= error.lineNumber %> in '+file,
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(uglify());

	return queue({objectMode:true},concatStream,minStream)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'JS Concat Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(concat('script.min.js'))
		.pipe(gulp.dest(paths.root))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.root))
		.pipe(notify({
			message: 'JS complete'
		}))
		.pipe(connect.reload());
});

})();