/*
 * grunt-init-events
 * https://gruntjs.com/
 *
 * Copyright (c) 2014 OceanLiu
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create New Project';

// Template-specific notes to be displayed before question prompts.
exports.notes = '初始化新项目模板\n' +
  '自动生成新项目需要用到的\n' +
  '基础目录结构、CSS和JavaScript常用库等等，\n' +
  '在真正开始写代码前的一些繁琐、枯燥的步棸。\n' +
  '走起...';

// Template-specific notes to be displayed after question prompts.
exports.after = '到现在为止，新项目模板已经创建完毕了...! ' +
  '\n\n' +
  '----------------------------------------------------------------- \n'+
  '-                                                               - \n'+
  '-  注意事项：                                                   - \n'+
  '-  1、npm install 安装项目相关依赖                              - \n'+
  '-  2、bower install 安装管理Web包（第三方库如：jQuery）         - \n'+
  '-  3、grunt 运行任务，包括监听Less样式文件修改、压缩、合并等等  - \n'+
  '-                                                               - \n'+
  '----------------------------------------------------------------- \n'+
  '-------------------------     搞起...   ------------------------- \n';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'oproject'}, [
    // Prompt for these values.
    init.prompt('name'),
    // init.prompt('title'),
    init.prompt('description', 'A New Project'),
    init.prompt('version', '0.1.0'),
    // init.prompt('repository'),
    // init.prompt('homepage'),
    // init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url')
  ], function(err, props) {
    // A few additional properties.
    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'libs/**'});

    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      name: props.name,
      version: props.version,
      description: props.description,
      // npm_test: 'grunt qunit',
      author_name: props.author_name,
      author_email: props.author_email,
      author_url: props.author_url,
      devDependencies: {
        'grunt': '~0.4.5',
        'grunt-contrib-less': '~0.11.0',
        'grunt-contrib-imagemin': '~0.5.0',
        'grunt-contrib-concat': '~0.5.0',
        'grunt-contrib-cssmin': '~0.10.0',
        'grunt-contrib-uglify': '~0.4.0',
        'grunt-contrib-htmlmin': '~0.3.0',
        'grunt-contrib-copy': '~0.5.0',
        'grunt-contrib-clean': '~0.6.0',
        'grunt-contrib-compress': '~0.9.1',
        'grunt-contrib-watch': '~0.6.1',
        'grunt-usemin': '~2.3.0',
        'grunt-filerev': '~0.2.1',
        'time-grunt': '~0.4.0',
        'load-grunt-tasks': '~0.6.0'
      },
    });

    init.writePackageJSON('bower.json', {
      name: props.name,
      version: props.version,
      description: props.description,
      main: 'assets/css/main.css',
      author_name: props.author_name,
      author_email: props.author_email,
      author_url: props.author_url,
      dependencies: {
        'jquery': '~2.1.1',
        'backbone': '~1.1.2',
        'underscore': '~1.6.0'
      }
    });

    // All done!
    done();
  });
};
