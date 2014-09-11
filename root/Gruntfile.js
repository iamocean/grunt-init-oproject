/*
 * @overview: Grunt配置
 */

module.exports = function(grunt){

    // 统计各个任务运行时间
    require('time-grunt')(grunt);

    grunt.initConfig({
        // Config
        pkg: grunt.file.readJSON('package.json'),
        archive_name: grunt.option('name') || '<%= pkg.name %>',
        author: 'iamocean',

        // task configuration
        // less文件路径
        less: {
            dev: {
                files: {
                    'assets/css/main.css':'assets/less/main.less'
                }
            },
            pro: {
                options: {
                    compress: true,
                    clearncss: true,
                    report: 'gzip'
                },
                files: {
                    'assets/css/main.min.css':'assets/less/main.less'
                }
            }
        },
        // 清除不需要的文件
        clean: {
            tmp: ['.tmp'],
            build: ['.tmp', 'build'],
            release: ['.tmp', '*.zip']
        },
        // 准备（分析页面需要压缩的css/js）
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'build'
            }
        },
        // 执行
        usemin: {
            html: ['build/index.html']
        },
        // 合并
        concat: {
            options: {
                separator: ';'
            }
        },
        // css压缩
        cssmin: {
            options: {
                report: 'gzip',
                banner: '/** \n' +
                    ' * -------------------------------------------------------------\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= author %> All rights reserved. \n' +
                    ' * ------------------------------------------------------------- \n' +
                    ' */ \n\n'
            }
        },
        // js压缩
        uglify: {
            options: {
                mangle: true,  // 混淆
                banner: '/** \n' +
                    ' * -------------------------------------------------------------\n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= author %> All rights reserved. \n' +
                    ' * ------------------------------------------------------------- \n' +
                    ' */ \n\n',
                compress: {
                    drop_console: true  // 去掉console.*
                },
                report: 'gzip'
            }
        },
        // 压缩图片
        imagemin: {
            dynamic: {
              files: [{
                expand: true,
                cwd: 'assets/img/',
                src: ['**/*.{jpg, jpeg, png, gif}'],
                dest: 'assets/img/'
              }]
            }
        },
        // 刷新静态资源
        filerev: {
            build: {
                src: [
                    'build/assets/img/**/*.{jpg, jpeg, gif, png, webp}',
                    'build/assets/css/*.css',
                    'build/assets/js/*.js',
                    // 'build/assets/vendor/*.js'
                ]
            }
        },
        // 压缩HTML
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/index.html': 'build/index.html'
                }
            }
        },
        // 复制文件
        copy: {
            build: {
                files: [
                    { expand: true, src: ['index.html'], dest: 'build/' },
                    { expand: true, src: ['assets/img/**'], dest: 'build/' },
                    {
                        expand: true,
                        src: [
                            '*',
                            '!.DS_Store',
                            '!bower_components',
                            '!bower.json',
                            '!node_modules',
                            '!Gruntfile.js',
                            '!package.json',
                            '!LICENSE-MIT',
                            '!README.md',
                            '!build',
                            '!*.zip'
                        ],
                        dest: 'build/'
                    }
                ]
            }
        },
        // 生成zip、tar、gzip包
        compress: {
            release: {
                options: {
                    archive: '<%= archive_name %>-<%= grunt.template.today("yyyy") %><%= grunt.template.today("mm") %><%= grunt.template.today("dd") %><%= grunt.template.today("HH") %><%= grunt.template.today("MM") %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: ''
            }
        },
        // 监听
        watch: {
            less: {
                files: ['assets/less/*.less'],
                tasks: ['less:dev']
            }
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');

    // Default task(s)
    grunt.registerTask('default', ['less:dev', 'watch']);

    // Compress images task(s)
    grunt.registerTask('img', ['imagemin']);

    // Build task(s)
    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'filerev',
        'usemin',
        'htmlmin:build',
        'clean:tmp'
    ]);

    // Generation package task(s)
    grunt.registerTask('package', ['clean:release', 'compress:release', 'clean:build']);
};
