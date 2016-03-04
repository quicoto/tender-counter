/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {

    /**
     * Dynamically load npm tasks
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			html: {
				files: ['source/html/*.html', 'source/html/*/*.html'],
				tasks: ['clean:html', 'clean:index', 'compile_html', 'copy:index']
			},
			css: {
				files: ['source/sass/**/*.{scss,sass}', 'source/img/sprite/*', ],
				tasks: ['css_compile', 'cssmin_regular']
			},
			js: {
				files: 'source/js/**/*.js',
				tasks: ['js_compile']
			},
			grunt_conf: {
				files: 'Gruntfile.js',
				tasks: 'default'
			},
            livereload: {
                options: {
                  livereload: LIVERELOAD_PORT
                },
                files: [
                  'html/{,*/}*.html',
                  'dist/css/*.css',
                  'dist/js/{,*/}*.js',
                  'dist/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
              }
		},

        connect: {
          options: {
            port: 9000,
            hostname: '*'
          },
          livereload: {
            options: {
              middleware: function (connect, options) {
                return [lrSnippet, mountFolder(connect, ''), connect.directory(options.base)];
              }
            }
          }
        },

        open: {
          server: {
            path: 'http://localhost:<%= connect.options.port %>'
          }
        },

		concat: {
			css_main: {
				src: ['source/css/main.css'],
				dest: 'dist/css/tender-main.css'
			},

			css_bootstrap: {
				src: [
					'source/css/vendor/font-awesome*.css',
					'source/css/vendor/bootstrap*/*.css'
				],
				dest: 'dist/css/tender-vendor.css'
			},

			css_pack: {
			    src: [
			        'dist/css/tender-vendor.css',
					'dist/css/tender-main.css',
			    ],
			    dest: 'dist/css/tender-pack.css'
			},

			js_main: {
				src : ['source/js/components/*.js', 'source/js/common.js'],
				dest : 'dist/js/tender-app.js'
			},

			js_vendor: {
				src : [
					'source/js/vendor/angular*.js',
					'source/js/vendor/other*/*.js'
				],
				dest : 'dist/js/tender-vendor.js',
				separator: ';'
			},

			js_debug_true: {
				src : ['source/js/__debug_true.js', 'dist/js/tender-vendor.js', 'dist/js/tender-app.js'],
				dest : 'dist/js/tender-pack-debug.js'
			},

			js_debug_false: {
				src : ['source/js/__debug_false.js', 'dist/js/tender-vendor.js', 'dist/js/tender-app.js'],
				dest : 'dist/js/tender-pack.js'
			}
		},

		cmq: {
			all: {
				files: {
					'dist/css': 'dist/css/*.css'
				}
			}
		},

		cssmin: {
			vendor: {
				src: 'dist/css/tender-vendor.css',
				dest: 'dist/css/tender-vendor.min.css'
			},

			main: {
				src: 'dist/css/tender-main.css',
				dest: 'dist/css/tender-main.min.css'
			},

			pack: {
				src: 'dist/css/tender-pack.css',
				dest: 'dist/css/tender-pack.min.css'
			}
		},

		uglify: {
			options: {
				compress: {
					global_defs: {
						DEBUG: true
					},
					dead_code: true,
					hoist_vars: true
				}
			},

			js: {
				files: {
					'dist/js/tender-app.min.js': ['dist/js/tender-app.js'],
					'dist/js/tender-vendor.min.js': ['dist/js/tender-vendor.js'],
					'dist/js/tender-pack.min.js': ['dist/js/tender-pack.js']
				}
			}
		},

		compass: {
			dev: {
				options: {
					config: 'configs/config.rb'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: 'configs/.jshintrc',
			},

			target: {
				src: "source/js/*.js"
			}
		},

		clean: {
			all: {
				src: ['html/*', 'dist/**', 'source/css/**', 'index.html']
			},

            index: {
				src: ['index.html']
			},

			html: {
				src: ['html/*']
			},

            productionCSS: {
                src: ["dist/css/*.css", "!dist/css/*.min.css", "dist/css/tender-vendor.min.css", "dist/css/tender-main.min.css"]
            },

            productionJS: {
                src: ["dist/js/*.js", "!dist/js/*.min.js", "dist/js/tender-main.min.js", "dist/js/tender-vendor.min.js", "dist/js/tender-app.min.js"]
            }
		},

		copy: {
			img: {
				expand: true,
				cwd: 'source/img',
				src: ['**'],
				dest: 'dist/img'
			},

			fonts: {
				expand: true,
				cwd: 'source/fonts',
				src: '**',
				dest: 'dist/fonts'
			},

			other: {
				expand: true,
				cwd: 'source/other',
				src: '*',
				dest: 'dist/other'
			},

            index: {
				expand: true,
				cwd: 'html/',
				src: ['**'],
				dest: ''
			},
		},

		jinja: {
			dist: {
				options: {
					templateDirs: ['source/html']
				},
				files: [{
				expand: true,
					dest: 'html/',
					cwd: 'source/html',
					src: ['**/!(_)*.html']
				}]
			}
		},

		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 4
				},
				files: [{
				expand: true,                  // Enable dynamic expansion
				cwd: 'dist/',          // Src matches are relative to this path
				src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
				dest: 'dist/'                  // Destination path prefix
				}]
			}
		}
	});

	grunt.registerTask('cssmin_regular', ['cssmin:main', 'cssmin:vendor', 'cssmin:pack']);

	grunt.registerTask('css_compile', ['compass:dev', 'concat:css_bootstrap', 'concat:css_main', 'cmq', 'concat:css_pack']);

	grunt.registerTask('js_compile', ['jshint', 'concat:js_main', 'concat:js_vendor', 'concat:js_debug_true', 'concat:js_debug_false']);

	grunt.registerTask('compile_html', ['jinja']);

	// Different Tasks that can be run
	// grunt
	grunt.registerTask('default', ['clean:all', 'css_compile', 'cssmin_regular', 'js_compile', 'uglify:js', 'copy', 'compile_html', 'imagemin', 'clean:productionCSS', 'clean:productionJS']);
	// grunt dev
	grunt.registerTask('dev', ['default', 'copy:index', 'connect:livereload', 'open', 'watch']);
};
