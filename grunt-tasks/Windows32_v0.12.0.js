module.exports = function (grunt) {
  'use strict';

  var paths = grunt.config.get('paths'),
    pkg = grunt.config.get('pkg');

  grunt.config.merge({
    clean: {
      'Windows32_v0.12.0': {
        files: [{
          dot: true,
          src: ['<%= paths.dist %>/Windows32_v0.12.0/*', '.build']
        }]
      },
      'build-dir-Windows32_v0.12.0': {
        files: [{
          dot: true,
          src: ['.build/app.nw', '.build/nw.exe']
        }]
      }
    },
    copy: {
      'Windows32_v0.12.0': {
        options: {
          mode: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= paths.nwjsSource %>/nwjs-v0.12.0-win-ia32',
            dest: '.build',
            src: '**'
          }
        ]
      }
    },
    compress: {
      'to-tmp-Windows32_v0.12.0': {
        options: {
          archive: '.build/app.nw',
          mode: 'zip'
        },
        files: [{
          expand: true,
          cwd: '<%= paths.app %>',
          src: ['**']
        }]
      },
      'final-app-Windows32_v0.12.0': {
        options: {
          archive: '<%= paths.dist %>/Windows32_v0.12.0/<%= pkg.name %>.zip'
        },
        files: [{
          expand: true,
          cwd: '.build',
          src: ['**']
        }]
      }
    }
  });

  grunt.registerTask('create-app-Windows32_v0.12.0', 'Create windows distribution.', function () {
    var done = this.async(),
      concat = require('concat-files');
    concat([
      '.build/nw.exe',
      '.build/app.nw'
    ], '.build/' + pkg.name + '.exe', function (error) {
      if(error){
        grunt.log.error(error);
        done(error);
      }
      done();
    });
  });

  grunt.registerTask('dist-win', function(){
    grunt.task.run([
      'clean:Windows32_v0.12.0',
      'copy:Windows32_v0.12.0',
      'compress:to-tmp-Windows32_v0.12.0',
      'create-app-Windows32_v0.12.0',
      'clean:build-dir-Windows32_v0.12.0',
      'compress:final-app-Windows32_v0.12.0'
    ]);
  });

};
