module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            js: {
                src: [
                    'app/src/js/core/main.js',
                    'app/src/js/core/**/*.js',
                    'app/src/js/models/Abstract.js',
                    'app/src/js/views/Abstract.js',
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
                dest: 'public/template/<%= pkg.name %>.html'
            }
        },
        jshint : {
            files: ['app/src/js/**/*.js']
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', ['jshint', 'concat']);

};
