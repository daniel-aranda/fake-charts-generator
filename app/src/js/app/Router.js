$w.Router = Backbone.Router.extend({
    
    routes : {
        "login"                         : "loginView",   
        "register"                      : "registerView",   
        "forgot-password"               : "forgotPasswordView",   
        "reset-password"                : "resetPasswordView",   
        "validate-hash"                 : "validateHashView",   
        "logout"                        : "logoutView",   
        "start"                         : "startView",   
        "project"                       : "projectView",   
        "*path"                         : "defaultRoute"   
    },

    defaultRoute : function() {
        this.go('start');
    },
    
    loginView : function(){
        var model = new $w.models.User();
        var view = new $w.views.Login({model : model});
        $w.Application.login(view);
    },
    
    registerView : function(){
        var model = new $w.models.User();
        var view = new $w.views.UserRegister({model : model});
        $w.Application.guestDisplay(view);
    },
    
    forgotPasswordView : function(){
        var model = new $w.models.users.ForgotPassword();
        var view = new $w.views.users.ForgotPassword({model : model});
        $w.Application.guestDisplay(view);
    },
    
    resetPasswordView : function(){
        var model = new $w.models.users.ResetPassword();
        var view = new $w.views.users.ResetPassword({model : model});
        $w.Application.guestDisplay(view);
    },
    
    validateHashView : function(){
        var model = new $w.models.users.ValidateHash();
        var view = new $w.views.users.ValidateHash({model : model});
        $w.Application.guestDisplay(view);
    },
    
    logoutView : function(){
        var view = new $w.views.Logout();
        $w.Application.login(view);
    },
    
    startView : function(){
        var view = new $w.views.Start();
        this.view(view);
    },
    
    projectView : function(){
        var view = new $w.views.ProjectIndex();
        this.view(view);
    },
    
    view : function(view){
        $w.Application.display(view);
    },
    
    go : function(section){
        this.navigate(section, {trigger: true});
    }

});
    