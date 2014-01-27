$w.Application = (function (Backbone, _, $) {
    
    var public_scope = {
        initialize : initialize,
        display : display,
        guestDisplay : guestDisplay,
        login : login,
        user : user
    };
    
    var _initialized = false;
    var _mainView;
    var _user;
    
    function initialize(){
        if( _initialized ){
            return true;
        }
        
        _initialized = true;
        
        $w.core.setup();
        
        invalidateMainView();
        
        setUpRouter();
        
    }
    
    function display(view){
        invalidateLogin();
        if( !user() ){
            $w.global.router.go('login');
            return null;
        }

        _mainView.display(view);
    }
    
    function login(view){
        view.on($w.events.USER_LOGGED, onUserLogged);
        view.on($w.events.USER_LOGOUT, onUserLogOut);
        _mainView.guestDisplay(view);
    }
    
    function guestDisplay(view){
        _mainView.guestDisplay(view);
    }
    
    function setUser(user){
        _user = new $w.models.User(user);
    }
    
    function onUserLogged(loggedUser){
        setUser(loggedUser);
        $w.global.router.go('start');  
    }
    
    function onUserLogOut(){
        $w.global.router.go('login');
    }
    
    function setUpRouter(){
        $w.global.router = new $w.Router();
        Backbone.history.start();
    }
    
    function invalidateMainView(){
        _mainView = new $w.views.Main({
            model : new $w.models.Main(),
            el : $('.view-holder')
        });
        _mainView.render();
    }
    
    function invalidateLogin(){
        if( user() ){
            return null;
        }
        
        $.ajax({
            type: 'GET',
            url: $w.global.apiUrl + 'login',
            dataType: 'json',
            success:loginLoadedHandler,
            async: false
        });
    }
    
    function loginLoadedHandler(response){
        if( response.logged ){
            setUser(response.user);
        }
    }

    function user(){
        return _user;
    }
    
    return public_scope;
    
}(window.Backbone, window._, window.$));