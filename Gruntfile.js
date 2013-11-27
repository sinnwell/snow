var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'closure-compiler': {
      'min': {
        js: [
          'src/Particle.js',
          'src/Snow.js'
        ],
        jsOutputFile: 'dist/<%= pkg.name %>.min.js',
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS'
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'example'),
              mountFolder(connect, 'src'),
              mountFolder(connect, 'bower_components')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          // '<%= yeoman.app %>/*.html',
          // '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
          'src/*.js'
        ]
      }
    },

    jshint: {
      files: ['src/*.js', 'package.json'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist'
          ]
        }]
      }
    },

  });

  // Default task.
  grunt.registerTask('serve', [
    'connect:livereload',
    'open',
    'watch'
  ]);

  // Default task.
  grunt.registerTask('default', [
    // 'jshint',
    'clean',
    'closure-compiler'
  ]);

};