var chai = require('chai'),
    assert = require('yeoman-generator').assert,
    path = require('path'),
    oaspGenTestUtils = require('../oasp-generator-test-utils');

module.exports = function () {
    chai.should();

    describe('simple', function () {
        before(function (done) {
            oaspGenTestUtils.deleteOldFilesAndCopyNewOnes(['app', 'config.json'], __dirname);
            oaspGenTestUtils.runBowerInstallAndCallDone(done);
        });
        describe('template', function () {
            describe('build:develop', function () {
                before(function (done) {
                    oaspGenTestUtils.runGulpAndCallDone(['clean'], function () {
                        oaspGenTestUtils.runGulpAndCallDone(['build:develop'], done);
                    });
                });

                describe('styles', function () {
                    it('should compile less file collecting code from whole app, allowing includes and propagating variables between modules', function () {
                        var outputLess = oaspGenTestUtils.resolvePathInTestDirectory('.tmp/css/oasp.css');
                        assert.fileContent(outputLess, /\.class1/);
                        assert.fileContent(outputLess, /\.class2/);
                    });
                    it('should inject css file into main html', function () {
                        oaspGenTestUtils.assert.contaisStyle('.tmp/index.html', 'css/oasp.css');
                    });
                });

                describe('sprites', function () {
                    it('should combine png files from sprite directory and generate associated css file and image', function () {
                        var outputSprite = oaspGenTestUtils.resolvePathInTestDirectory('.tmp/css/sprite.css');
                        assert.fileContent(outputSprite, /\.icon-de-24/);
                        assert.fileContent(outputSprite, /\.icon-en-24/);
                        assert.fileContent(outputSprite, 'url(../img/sprite.png)');
                        assert.file(oaspGenTestUtils.resolvePathInTestDirectory('.tmp/img/sprite.png'));
                    });
                    it('should inject sprite css file into main html', function () {
                        oaspGenTestUtils.assert.contaisStyle('.tmp/index.html', 'css/sprite.css');
                    });
                });

                describe('index html', function () {
                    it('should contain bower libs', function () {
                        oaspGenTestUtils.assert.contaisScript('.tmp/index.html', 'bower_components/angular/angular.js');
                        oaspGenTestUtils.assert.contaisScript('.tmp/index.html', 'bower_components/jquery/dist/jquery.js');
                    });
                    it('should contain app sources in proper order', function () {
                        oaspGenTestUtils.assert.contaisScript('.tmp/index.html', 'bower_components/angular/angular.js');
                        oaspGenTestUtils.assert.contaisScript('.tmp/index.html', 'bower_components/jquery/dist/jquery.js');
                    });
                });
            });

            describe('build:dist', function () {
                var distDirectory = path.join(oaspGenTestUtils.testDirectory, 'dist');
                before(function (done) {
                    oaspGenTestUtils.runGulpAndCallDone(['clean'], function () {
                        oaspGenTestUtils.runGulpAndCallDone(['build:dist'], done);
                    });
                });

                describe('styles', function () {
                    it('should compile less file collecting code from whole app, allowing includes and propagating variables between modules', function () {
                        var outputLess = oaspGenTestUtils.queryAndResolveFileInTestDirectory('css/oasp-*.css', distDirectory);
                        assert.fileContent(outputLess, /\.class1/);
                        assert.fileContent(outputLess, /\.class2/);
                    });
                    it('should inject css file into main html', function () {
                        var outputLess = oaspGenTestUtils.queryFileInTestDirectory('css/oasp-*.css', distDirectory);
                        oaspGenTestUtils.assert.contaisStyle('dist/index.html', outputLess);
                    });
                });

                describe('sprites', function () {
                    it('should combine png files from sprite directory and generate associated css file and image', function () {
                        var outputSprite = oaspGenTestUtils.queryAndResolveFileInTestDirectory('css/oasp-*.css', distDirectory);
                        assert.fileContent(outputSprite, /\.icon-de-24/);
                        assert.fileContent(outputSprite, /\.icon-en-24/);
                        assert.fileContent(outputSprite, 'url(../img/sprite.png)');
                        assert.file(oaspGenTestUtils.resolvePathInTestDirectory('dist/img/sprite.png'));
                    });
                });

                describe('images', function () {
                    it('should copy non sprite images to dist', function () {
                        assert.file(oaspGenTestUtils.resolvePathInTestDirectory('dist/main/img/Koala.jpg'));
                        assert.noFile(oaspGenTestUtils.resolvePathInTestDirectory('dist/main/img/sprite/de-24.png'));
                        assert.noFile(oaspGenTestUtils.resolvePathInTestDirectory('dist/main/img/de-24.png'));
                    });
                });

                describe('index html', function () {
                    it('should contain concatenated vendor file', function () {
                        var outputVendor = oaspGenTestUtils.queryFileInTestDirectory('js/vendor-*.js', distDirectory);
                        oaspGenTestUtils.assert.contaisScript('dist/index.html', outputVendor);
                        oaspGenTestUtils.assert.noContaisScript('dist/index.html', 'bower_components/angular/angular.js');
                    });
                });
            });
        });
    });
};
