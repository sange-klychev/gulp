import gulp from 'gulp';

import {path} from './gulp/configs/path.js';
import {plugins} from './gulp/configs/plugins.js';

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    gulp,
    path,
    plugins
}

import {copy} from './gulp/tasks/copy.js';
import {reset} from './gulp/tasks/reset.js';
import {html} from './gulp/tasks/html.js';
import {server} from './gulp/tasks/server.js';
import {scss} from './gulp/tasks/scss.js';
import {js, apiConfig} from './gulp/tasks/js.js';
import {images} from './gulp/tasks/images.js';
import {svgSprite} from './gulp/tasks/svgSprite.js';
import {zip} from './gulp/tasks/zip.js';
import {ftp} from './gulp/tasks/ftp.js';
import {fontsStyle, otfToTtf, ttfToWoff} from './gulp/tasks/fonts.js';

// Наблюдатель за изменениями в файлах
function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, apiConfig, js, images, svgSprite));

// Построение сценариев выполнения задач
export const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
export const build = gulp.series(reset, mainTasks);
export const deployZIP = gulp.series(reset, mainTasks, zip);
export const deployFTP = gulp.series(reset, mainTasks, ftp);

// Выполнение сценария по умолчанию
gulp.task('default', dev);

export {svgSprite};