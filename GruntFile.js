module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {

            options: {

                separator: '\n',

                process : function(src, filepath){
                    var ext = filepath.split('.').pop();
                    var path = filepath.split('/');
                    var name = path.pop();
                    var folder = path.pop();
                    name = name.replace('.' + ext, '');
                    if ( ext.toLowerCase() == 'html'){
                        var templateName = folder + '_' + name;
                        return '<script type="text/x-FCK-tpl" class="tpl ' + templateName + '">\n' + src + '</script>\n';
                    }
                    return src;
                }

            },

            js: {
                src: [
                    'app/src/js/core/main.js',
                    'app/src/js/core/**/*.js',
                    'app/src/js/models/Abstract.js',
                    'app/src/js/views/Abstract.js',
                    'app/src/js/views/charts/Abstract.js',
                    'app/src/js/views/charts/renderers/**/*.js',
                    'app/src/js/controls/form/ComponentAbstract.js',
                    'app/src/js/controls/**/*.js',
                    'app/src/js/app/**/*.js',
                    'app/src/js/models/**/*.js',
                    'app/src/js/collections/**/*.js',
                    'app/src/js/views/**/*.js',
                    'app/src/js/app.js'
                ],
                dest: 'public/js/<%= pkg.name %>.js'
            },

            css : {
                src: [
                    'app/src/css/**/*.css'
                ],
                dest: 'public/css/<%= pkg.name %>.css'
            },

            html : {
                src: [
                    'app/src/html/**/*.html'
                ],
                dest: 'public/templates/<%= pkg.name %>.html'
            }

        },

        jshint : {

            files: ['app/src/js/**/*.js']

        },

        watch: {

            files: [
                '<%= concat.js.src %>',
                '<%= concat.css.src %>',
                '<%= concat.html.src %>'
            ],

            options : {
                spawn : false
            },

            tasks: ['jshint', 'concat']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['watch']);

};
