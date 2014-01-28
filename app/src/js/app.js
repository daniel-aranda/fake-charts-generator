$w.Application = (function (Backbone, _, $) {
    
    var public_scope = {
        initialize : initialize,
        display : display,
        guestDisplay : guestDisplay,
        login : login,
        user : user,
        auth : auth,
        fireBase : fireBase
    };
    
    var _initialized = false;
    var _lastProtectedView = null;
    var _mainView;
    var _user;
    var _fireBase;
    var _auth;

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
        _lastProtectedView = view;
        if( user() ){
            displayProtected();
        }else{
            invalidateLogin();
        }
    }

    function displayProtected(){
        if( _lastProtectedView ){
            _mainView.display(_lastProtectedView);
        }else{
            $w.global.router.go('start');
        }
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
        defaultPageForLoggedUser();
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
    
    function invalidateFireBase(){
        if( _fireBase ){
            return null;
        }

        _fireBase = new Firebase($w.Config.server() + 'application/');

    }
    function invalidateLogin(){
        if( _auth ){
            return null;
        }
        invalidateFireBase();
        _auth = new FirebaseSimpleLogin(_fireBase, loginLoadedHandler);
    }

    function loginLoadedHandler(error, user) {
        if (user) {
            setUser(user);
            displayProtected();
            return null;
        }

        $w.global.router.go('login');
        $w.events.trigger($w.events.USER_LOGGING_ERROR, error);
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

    return public_scope;
    
}(window.Backbone, window._, window.$));