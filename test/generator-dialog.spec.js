'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var fs = require('fs-extra');
var oaspGenTestUtils = require('./app-suite-testcases/oasp-generator-test-utils');
var mkdirp = require('mkdirp');

describe('oasp:module', function () {

    var runModuleGenerator = function (directory, argument, done) {
        mkdirp.sync(directory);
        process.chdir(directory);
        helpers.run(path.join(__dirname, '../dialog'), {tmpdir: false})
            .withArguments(argument)
            .withGenerators([path.join(__dirname, '../controller')])
            .withOptions({ 'skip-install': true })
            .on('end', done);
    };

    before(function (done) {
        helpers.testDirectory(oaspGenTestUtils.testDirectory, function () {
            fs.copy(path.join(__dirname, 'generator-templates/test-case-1'), oaspGenTestUtils.testDirectory, done);
        });
    });


    describe('calling generator in main directory with dialog name and module name', function () {

        before(runModuleGenerator.bind(null, oaspGenTestUtils.testDirectory, 'new-dialog component-1'));

        it('creates files', function () {
            assert.file([
                'app/component-1/new-dialog/new-dialog.controller.js',
                'app/component-1/new-dialog/new-dialog.controller.spec.js',
                'app/component-1/new-dialog/new-dialog.tpl.html',
            ]);
        });

        it('links created dialog to proper module', function () {
            assert.fileContent('app/component-1/new-dialog/new-dialog.controller.js', 'angular.module(\'app.component1\'');
            assert.fileContent('app/component-1/new-dialog/new-dialog.controller.js', 'NewDialogCntl');
        });
    });

    describe('calling generator in custom directory with dialog name and module name', function () {

        before(runModuleGenerator.bind(null, path.join(oaspGenTestUtils.testDirectory, 'app/component-2'), 'new-dialog main'));

        it('creates files', function () {
            assert.file([
                'app/main/new-dialog/new-dialog.controller.js',
                'app/main/new-dialog/new-dialog.controller.spec.js',
                'app/main/new-dialog/new-dialog.tpl.html',
            ]);
        });

        it('links created dialog to proper module', function () {
            assert.fileContent('app/main/new-dialog/new-dialog.controller.js', 'angular.module(\'app.main\'');
            assert.fileContent('app/main/new-dialog/new-dialog.controller.js', 'NewDialogCntl');
        });
    });

    describe('calling generator in custom directory with dialog name', function () {

        before(runModuleGenerator.bind(null, path.join(oaspGenTestUtils.testDirectory, 'app/component-2'), 'new-dialog'));

        it('creates files in current directory', function () {
            assert.file([
                'app/component-2/new-dialog/new-dialog.controller.js',
                'app/component-2/new-dialog/new-dialog.controller.spec.js',
                'app/component-2/new-dialog/new-dialog.tpl.html',
            ]);
        });

        it('links created dialog to proper module', function () {
            assert.fileContent('app/component-2/new-dialog/new-dialog.controller.js', 'angular.module(\'app.component2\'');
            assert.fileContent('app/component-2/new-dialog/new-dialog.controller.js', 'NewDialogCntl');
        });
    });
});
