var files = require('../files.json');

module.exports = function (Generator) {

    Generator.prototype.prepareFiles = function () {
        var that = this;
        that.staticFiles = files.staticFiles;
        that.templateFiles = {};
        files.templateFiles.forEach(function (file) {
            that.templateFiles[file] = file;
        });
    };
};