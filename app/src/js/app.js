$w.Application = (function (Backbone, _, $) {
    
    var public_scope = {
        initialize : initialize,
        display : display,
        guestDisplay : guestDisplay,
        login : login,
        user : user,
        auth : auth,
        fireBase : fireBase,
        loginRequested : loginRequested
    };
    
    var _initialized = false;
    var _lastProtectedRoute = null;
    var _mainView;
    var _user;
    var _fireBase;
    var _auth;
    var _loginRequested = false;

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
        if( user() ){
            _mainView.display(view);
        }else{
            _lastProtectedRoute = Backbone.history.fragment;
            invalidateLogin();
        }
    }

    function displayProtected(){
        if( _lastProtectedRoute ){
            $w.global.router.go(_lastProtectedRoute);
            _lastProtectedRoute = null;
        }else{
            $w.global.router.go('start');
        }
    }
    
    function login(view){
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
        $w.Application.fireBase().child('users').child(_user.getKey()).set(loggedUser);
        displayProtected();
    }

    function onUserLogOut(){
        _user = null;
        $w.global.router.go('login');
    }
    
    function setUpRouter(){
        $w.global.router = new $w.Router();
        $w.global.router.initialize();
        Backbone.history.start();
    }
    
    function invalidateMainView(){
        _mainView = new $w.views.Main({
            model : new $w.models.Main(),
            el : $('.view-holder')
        });
        _mainView.render();
    }
    
    function invalidateFireBase(){
        if( _fireBase ){
            return null;
        }

        _fireBase = new Firebase($w.Config.server());

    }
    function invalidateLogin(){
        if( _auth ){
            return null;
        }

        invalidateFireBase();
        _loginRequested = true;
        $w.global.router.go('initializing');
        _auth = new FirebaseSimpleLogin(_fireBase, loginLoadedHandler);
    }

    function loginLoadedHandler(error, user) {
        if (user) {
            if( !_user ){
                onUserLogged(user);
            }
            return null;
        }

        if(error){
            $w.events.trigger($w.events.USER_LOGGING_ERROR, error);
        }else{
            if( _user ){
                onUserLogOut();
            }else{
                if( Backbone.history.fragment == 'initializing' ){
                    $w.global.router.go('login');
                }
            }
        }

    }

    function user(){
        return _user;
    }

    function auth(){
        invalidateLogin();
        return _auth;
    }

    function fireBase(){
        invalidateFireBase();
        return _fireBase;
    }

    function loginRequested(){
        return _loginRequested;
    }

    return public_scope;
    
}(window.Backbone, window._, window.$));