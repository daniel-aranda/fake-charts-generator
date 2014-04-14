$w.Router = Backbone.Router.extend({

    history : [],
    
    routes : {
        "login"                         : "loginView",   
        "register"                      : "registerView",   
        "forgot-password"               : "forgotPasswordView",   
        "reset-password"                : "resetPasswordView",   
        "validate-hash"                 : "validateHashView",   
        "logout"                        : "logoutView",   
        "start"                         : "startView",
        "initializing"                  : "initializingView",
        "new"                           : "newChart",
        "create-chart/:id"              : "createChart",
        "editor/:id"                    : "editorChart",
        "*path"                         : "defaultRoute"
    },

    initialize : function(){
        $w.util.bindAll(this);
    },

    defaultRoute : function() {
        this.go('start');
    },

    newChart : function(){
        if( !$w.Application.validateLogin() ){
            return null;
        }

        var c = new $w.collections.charts.Chart();
        var newChart = c.add({user_id : $w.Application.user().id})[0];
        this.go('create-chart/' + newChart.id);
    },

    createChart : function(id){
        if( !$w.Application.validateLogin() ){
            return null;
        }

        var chartModel = new $w.models.charts.RemoteChart({id : id});

        var view = new $w.views.charts.CreateForm({model : chartModel});
        this.view(view);
    },

    editorChart : function(id){
        if( !$w.Application.validateLogin() ){
            return null;
        }

        var chartModel = new $w.models.charts.RemoteChart({id : id});

        var view = new $w.views.charts.Editor({model : chartModel});
        this.view(view);
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

    initializingView : function(){
        if( !$w.Application.loginRequested() || $w.Application.user() ){
            this.defaultRoute();
        }else{
            var view = new $w.views.Initializing();
            $w.Application.guestDisplay(view);
        }
    },

    view : function(view){
        $w.Application.display(view);
    },
    
    go : function(section){
        this.navigate(section, {trigger: true});
    }

});