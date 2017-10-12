const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      webpackStream = require('webpack-stream'),
      webpackConfig = require('./webpack.config'),
      browserSync = require('browser-sync'),
      jsonServer = require('json-server'),
      server = jsonServer.create(),
      router = jsonServer.router('db.json'),
      middlewares = jsonServer.defaults();

const config = {
  paths: {
    sass: './src/scss/**/*.scss',
    entry: './js/index.js',
    js: './src/js/**/*.js',
    html: './public/index.html',
    dist: './public'
  },
  output: {
    js: 'js',
    css: 'css'
  },
  production: false
}

gulp.task('build-js', function (){
  return gulp.src(config.paths.js)
    .pipe(webpackStream(webpackConfig))
    .pipe(plugins.rename('bundle.js'))
    .pipe(plugins.if(config.production, plugins.uglify()))
    .pipe(gulp.dest(`${config.paths.dist}/${config.output.js}`))
});

gulp.task('build-scss', function(){
  return gulp.src(config.paths.sass)
    .pipe(plugins.if(!config.production, plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.autoprefixer({ browsers: ['last 5 versions'] }))
    .pipe(plugins.if(config.production, plugins.cleanCss()))
    .pipe(plugins.if(!config.production, plugins.sourcemaps.write()))
    .pipe(plugins.if(config.production, plugins.rename({ suffix: '.min' })))
    .pipe(gulp.dest(`${config.paths.dist}/${config.output.css}`))
});

gulp.task('serve', function(){
  browserSync.init({
    open: 'external',
    proxy: {
      target: "http://localhost:3000",
    },
    serveStatic: [config.paths.dist]
  })
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload)
});
gulp.task('start-fake-api', function(){
  server.use(middlewares)
  server.use('/api', router)
  server.listen(3000, () => {
    console.log('JSON Server is running')
  })
});

gulp.task('watch', function(){
  gulp.watch(config.paths.sass, gulp.series('build-scss'));
  gulp.watch(config.paths.js, gulp.series('build-js'));
});

gulp.task('build', gulp.parallel('build-js', 'build-scss'));
gulp.task('default', gulp.series('build', gulp.parallel('start-fake-api', 'watch', 'serve')));