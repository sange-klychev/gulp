import webpackStream from 'webpack-stream';
import rename from 'gulp-rename';
import terser from 'gulp-terser';

export const js = () =>
    app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'JS',
                message: 'Error: <%= error.message %>'
            })
        ))
        .pipe(webpackStream({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'app.min.js'
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browserSync.stream())

export const apiConfig = () => {
    const path = app.isDev ? app.path.src.devConfig : app.path.src.prodConfig;
    return app.gulp.src(path)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'apiConfig',
                message: 'Error: <%= error.message %>'
            })
        ))
        .pipe(terser())
        .pipe(rename({
            basename: 'config',
            extname: '.min.js'
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browserSync.stream());
}