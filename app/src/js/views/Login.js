$w.views.Login = $w.controls.UIForm.extend({

    template : 'login_login',

    events : function(events){
        var this_events = {
            'click .twitter' : 'loginWithTwitter',
            'click .google' : 'loginWithGoogle',
            'click .facebook' : 'loginWithFacebook',
            'click .github' : 'loginWithGithub'
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        this._super();
        this.$el.hide();
        //$w.events.on($w.events.USER_LOGGING_ERROR, error);
    },


    afterRender : function(){
        this._super();
        this.$el.show();
    },

    loginWithTwitter : function(){
        $w.Application.auth().login('twitter');
    },

    loginWithGoogle : function(){
        $w.Application.auth().login('google');
    },

    loginWithFacebook : function(){
        $w.Application.auth().login('facebook');
    },

    loginWithGithub : function(){
        $w.Application.auth().login('github');
    },

    errorHandler : function(response){
        this.$('.form_errors').html('The email or password you entered is incorrect.');
    }

});