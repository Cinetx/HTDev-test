// Для разработчки gulp dev

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');



const include = () => {
  return gulp.src(['./source/html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest('./source/'));
}
exports.include = include;

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
}

exports.styles = styles;

const devStyles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })
      // csso()
    ]))
    // .pipe(rename("style.min.css"))
    // .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

// HTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}


// Scripts

const scripts = () => {
  return gulp.src("source/js/main.js")
    // .pipe(uglify())
    // .pipe(rename("script.min.js"))
    // .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src("source/images/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/images"))
}

exports.images = images;


// Оптимизация svg
const svgmin = () => {
  return gulp.src("source/images/svg/*.svg")
    .pipe(imagemin([
      imagemin.svgo(
        {
          plugins: [
            { removeViewBox: false },
            { removeTitle: true },
            { removeUselessDefs: true },
            { removeStyleElement: true },
            { removeDoctype: true },
            { removeXMLProcInst: true },
            { removeComments: true },
            { removeMetadata: true },
            { removeDesc: true },
            { removeEditorsNSData: true },
            { removeEmptyAttrs: true },
            { removeHiddenElems: true },
            { removeEmptyText: true },
            { removeEmptyContainers: true },
            { cleanupEnableBackground: true },
            { minifyStyles: true },
            { convertStyleToAttrs: true },
            { convertColors: true },
            { convertTransform: true },
            {
              removeUnknownsAndDefaults: {
                keepDataAttrs: false
              }
            },
            { removeNonInheritableGroupAttrs: true },
            { removeUselessStrokeAndFill: true },
            { removeUnusedNS: true },
            { cleanupIDs: true },
            { moveElemsAttrsToGroup: true },
            { moveGroupAttrsToElems: true },
            { collapseGroups: true },
            { mergePaths: true },
            { convertShapeToPath: true },
            { convertEllipseToCircle: true },
            { sortDefsChildren: true }
          ]

        }

      )
    ]))
    .pipe(gulp.dest("source/images/svg"))
}

exports.svgmin = svgmin;

// WebP

const createWebp = () => {
  return gulp.src("source/images/**/*.{jpg,png}")
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("build/images"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/images/svg/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/images"))
    .pipe(gulp.dest("build/images"));
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/images/**/*.{jpg,png,svg}",
    "source/css/style.css",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "source"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(devStyles));
  gulp.watch("source/js/**/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/html/**/*.html", gulp.series(html, reload, include));
}


// разработка
const dev = gulp.series(
  gulp.series(
    server,
    watcher
  )
);

exports.dev = dev;

// Build
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    images,
    createWebp
  ));

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));


// Конвертер шрифтов
const fontsConvertToWoff = () => {
  return gulp.src(['./source/fonts/**/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('./source/fonts/'));
}
exports.fontsConvertToWoff = fontsConvertToWoff;
const fontsConvertToWoff2 = () => {
  return gulp.src(['./source/fonts/**/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('./source/fonts/'));
}
exports.fontsConvertToWoff2 = fontsConvertToWoff2;
