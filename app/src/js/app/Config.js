$w.Config = (function (Backbone, _, $) {

    var public_scope = {
        server : server
    };

    var currentServer = 1;

    var bd = {
        server1 : 'https://crackling-fire-4479.firebaseio.com/'
    };

    function server(){
        return bd['server' + currentServer];
    }

    return public_scope;

}(window.Backbone, window._, window.$));