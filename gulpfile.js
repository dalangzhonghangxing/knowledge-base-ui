/**
 * Created by xiafan on 16/8/27.
 * for the whole projects, we need to copy all non-js files into the target directory;<br>
 * for each app html file, we need to do the following steps automatically:
 * <ul>
 *     <li>inject Javascripts maintained by bower into html</li>
 *     <li>injects Javascripts of common modules into html</li>
 *     <li>injects Javascripts of modules implemented for the html</li>
 * </ul>
 */
var through = require('through2');
var gulp = require('gulp');
var es = require('event-stream');
var inject = require('gulp-inject');//var mainBowerFiles = require('gulp-main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var gulpFilter = require('gulp-filter');
var useref = require('gulp-useref');
var series = require('stream-series');
var eol = require('gulp-eol');
var wiredep = require('wiredep');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var map = require('map-stream');
var concat = require('gulp-concat');
//var livereload = require('gulp-livereload');
var mainBowerFiles = require('main-bower-files');
var debug = require('gulp-debug');
var clean = require('gulp-clean');
var install = require('gulp-install');

//used to create file
var File = require('vinyl');
var fs = require('graceful-fs');
var lazystream = require('lazystream');
//var stripBomFromStream = require('strip-bom-stream');
var path = require('path');
var DEV_DIR = "./build";
var DEPLOY_DIR = "./dist";
var SRC_DIR = "./src";
var isDeploy = false;

gulp.task("clean", function () {
    return gulp.src(["build/*", "dist/*"]).pipe(clean());
});

gulp.task("deploy", ["deploy-copy", "deploy-department"], function (done) {
    console.log("begin deploy");
    return done();
});

/**
 * inject Javascripts into department pages used in the development enviroments
 */
gulp.task('deploy-department', ['deploy-copy'], injectForDeploy);

gulp.task('deploy-copy', function () {
    isDeploy = true;
    return copyModulesToDestForDeploy();
});

gulp.task("dev", ["dev-copy", "dev-department"], function (done) {
    return done();
});

gulp.task('dev-copy', function () {
    return copyModulesToDestForDev();
});

/**
 * inject Javascripts into department pages used in the development enviroments
 */
gulp.task('dev-department', ['dev-copy'], function () {
    return injectForDev();
});

//the default task will generate codes for both development and deployment enviroments
gulp.task("default", ["development"]);

//install bower dependencies
gulp.task('bower-install', function () {
    return series(gulp.src("./bower.json", {
        cwd: "./",
        base: "./src"
    }).pipe(debug()).pipe(install({cwd: "./"})));
    console.log(cwd);
});

/**
 * 1. 判断dir是否是目录，是目录的话就递归遍历目录下面的文件
 * 2. 如果不是目录，就直接返回
 * @param dir
 */

function listDirectory(file, enc, cb) {
    var vm = this;

    if (file.isStream()) {
        this.emit('error', new PluginError('gulp-main-bower-files', 'Streams are not supported!'));
        return cb();
    }

    if (file.isBuffer()) {
        var bowerFolder = getBowerFolder(file.base);

        opts = {};
        opts.filter = null;
        opts.paths = {};
        opts.paths.bowerJson = file.path;
        opts.paths.bowerDirectory = file.base += bowerFolder;

        var fileNames = mainBowerFiles(opts, null);

        fileNames.forEach(function (fileName) {
            listDirectoryIntern(vm, file, fileName, enc, cb);
        }, this);
    }
    return cb();
}
/***
 *
 * 判断是否是个目录,如果是目录就递归遍历
 * @param pipeObj
 * @param bowerFile
 * @param fileName
 */
function listDirectoryIntern(pipeObj, bowerFile, fileName, enc, cb) {
    var newFile = bowerFile.clone();
    var stat = fs.statSync(fileName);
    if (stat && !stat.isDirectory()) {
        newFile.path = fileName;
        newFile.contents = fs.readFileSync(newFile.path);
        pipeObj.push(newFile);
    } else if (stat) {
        fs.readdirSync(fileName).forEach(function (filename) {
            var path = fileName + "/" + filename;
            var stat = fs.statSync(path);
            if (stat && stat.isDirectory()) {
                listDirectoryIntern(pipeObj, bowerFile, path, enc, cb)
            } else {
                newFile = bowerFile.clone();
                newFile.path = path;
                newFile.contents = fs.readFileSync(newFile.path);
                pipeObj.push(newFile);
            }
        })
    }
}
function getBowerFolder(base) {
    var path = require('path');
    var rcPath = path.join(base, '.bowerrc');
    if (fs.existsSync(rcPath)) {
        var config = JSON.parse(fs.readFileSync(rcPath));
        if (config.directory) {
            return config.directory;
        }
    }
    return 'bower_components/';
}

/**
 * copy source codes into the dest
 * @param dest
 * @returns {*}
 */
function copyModulesToDestForDeploy() {
    isDeploy = true;
    console.log("begin to copy compiled files into target directory");
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //copy bower files
    var libJs = gulp.src('./bower.json')
                    .pipe(through.obj(listDirectory)).pipe(map(chooseBowerFile))
                    .pipe(gulp.dest("./lib/js", {cwd: DEPLOY_DIR}));
    var libStyle = gulp.src("./lib/style/**", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    //common modules: first copy non-js files, then generate compressed js
    var commonCodes = gulp.src("./common/**/!(*.js)", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    var commonJS = gulp.src(["./common/**/*!(.spec).js"], srcDir)
                       .pipe(gulpFilter("**/!(*.spec.js)"))
                       .pipe(angularFilesort()).pipe(concat("/common.app.min.js"))
                       .pipe(uglify()).pipe(gulp.dest(DEPLOY_DIR + "/common"));
    //copy modules
    var modules = gulp.src("./!(common|lib)/**/!(*.js)", srcDir).pipe(gulp.dest(DEPLOY_DIR));
    return es.merge(libJs, libStyle, commonCodes, commonJS, modules);

}

/**
 * for each app:
 * 1. copy all files into the build directory
 * 2. inject javascripts into htmls
 *
 */
function injectForDeploy() {

    console.log("inject for deploy environment");
    var dest = DEPLOY_DIR;
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //first inject bower dependencies
    var apps = gulp.src("./!(common|lib)/**/*.app.js", srcDir).pipe(map(wiredepForApp));
    //inject page specific Javascripts and store injected files into target directory
    apps = apps.pipe(useref()).pipe(gulpif("*.js", uglify())).pipe(map(changeBase))
               .pipe(gulp.dest(dest));

    //inject common libraries and store injected files into target directory
    var commonJS = gulp.src("./common/common.app.min.js", {read: false, cwd: dest, base: dest});
    apps = apps.pipe(debug({title: "ready for inject"}))
               .pipe(inject(commonJS, {relative: true}))
               .pipe(gulp.dest(dest));

    return series(apps);
}

/**
 * copy source codes into the dest
 * @param dest
 * @returns {*}
 */
function copyModulesToDestForDev() {

    console.log("begin to copy compiled files into target directory");
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};

    //copy bower files
    var libJs = gulp.src('./bower.json').pipe(debug())
                    .pipe(through.obj(listDirectory))
                    .pipe(gulp.dest("./lib/js", {cwd: DEV_DIR}));
    var libStyle = gulp.src("./lib/style/**", srcDir).pipe(gulp.dest(DEV_DIR));
    //copy common
    var commonCodes = gulp.src("./common/**/*", srcDir).pipe(gulp.dest(DEV_DIR));

    //copy modules
    var modules = gulp.src("./!(common|lib)/**/*", srcDir).pipe(gulp.dest(DEV_DIR));

    return es.merge(libJs, libStyle, commonCodes, modules);

}

/**
 * module files and inject them automatically.
 * for each app:
 * 1. copy all files into the build directory
 * 2. inject javascripts into htmls
 *
 */
function injectForDev() {
    var dest = DEV_DIR;
    var srcDir = {cwd: SRC_DIR, base: SRC_DIR};
    //first inject bower dependencies
    var apps = gulp.src("./!(common|lib)/**/*.app.js", srcDir).pipe(map(wiredepForApp))
                   .pipe(map(changeBase)).pipe(gulp.dest(dest));
    //inject common libraries
    var commonJS = gulp.src("./common/**/*.js", {read: true, cwd: dest, base: dest}).pipe(
        gulpFilter("**/!(*spec.js)")).pipe(angularFilesort());
    apps.pipe(inject(commonJS, {relative: true})).pipe(gulp.dest(dest));
    return series(apps);

}

function wiredepForApp(appFile, cb) {
    var fileName = path.basename(appFile.path, ".app.js");
    var pathDir = path.dirname(appFile.path);
    var htmlFile = new File({
        cwd: appFile.cwd,
        base: appFile.base,
        path: pathDir + "/" + fileName + ".html"
    });

    console.log("wiredepForApp:" + appFile.path);

    fs.readFile(htmlFile.path, function (err, data) {
        try {
            htmlFile.contents = data;
            //var opts = {bowerJson: require(pathDir + "/bower.json")};
            var opts = getWiredepOptions(require(pathDir + "/bower.json"));
            opts.stream = {
                src: htmlFile.contents.toString(),
                path: htmlFile.path,
                fileType: path.extname(htmlFile.path).substr(1)
            };

            htmlFile.contents = new Buffer(wiredep(opts));
            cb(null, htmlFile);
        } catch (err) {
            cb(err, null);
        }
    });

}

//参考链接https://gist.github.com/CarbonFactory/851d285269e379fb6529进行的修改
getWiredepOptions = function (jsonFile) {
    var options = {
        bowerJson: jsonFile,
        fileTypes: {
            html: {
                block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                detect: {
                    js: /<script.*src=['"]([^'"]+)/gi
                    //css: /<link.*href=['"]([^'"]+)/gi
                },
                replace: {
                    js: function (filePath) {
                        if (isDeploy && filePath.indexOf(".min") === -1) {
                            var minFilePath = filePath.replace('.js', '.min.js');
                            //此处的filePath是相对路径,因此需要进行拼接
                            var fullPath = path.join(process.cwd(), "/src",
                                                     minFilePath.substr(minFilePath.indexOf("/lib")));
                            if (fs.existsSync(fullPath) == false) {
                                return '<script src="' + filePath + '"></script>';
                            } else {
                                return '<script src="' + minFilePath + '"></script>';
                            }
                        } else {
                            return '<script src="' + filePath + '"></script>';
                        }
                    }
                }
            }
        }
    };
    return options;
};

/**
 * 该函数用于判断第三方库是否有minfied文件,有的话选择相应的压缩版本。这个实现效率不高,由于js文件在进入该文件之前已经读取过一遍,
 * 导致同一个库的js文件的两个版本都被读取
 * @param file
 * @param cb
 */
function chooseBowerFile(file, cb) {
    filePath = file.path;
    if (isDeploy && filePath.indexOf(".min") === -1) {
        var minFilePath = filePath.replace('.js', '.min.js');
        //此处的文件是绝对路径,不在需要拼接
        //var fullPath = path.join(process.cwd(), minFilePath);
        if (fs.existsSync(minFilePath) != false) {
            filePath = minFilePath;
            file.contents = fs.readFileSync(filePath);
        }
    }
    file.path = filePath;
    cb(null, file);
}

//---------------------------------------------------------------
//some helping function for debug

function changeBase(file, cb) {
    file.base = SRC_DIR;
    cb(null, file);
}

/**
 *
 * @param func: a function that accepts a vlny-fs file object
 */
function filePathProcess(func) {
    return map(function (file, cb) {
        func(file);
        cb(null, file);
    });
}

function fileLogFunction() {
    return filePathProcess(function (file) {
        console.log("base:" + file.base + ";path:" + file.path)
    });
}

