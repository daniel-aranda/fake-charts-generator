$w.views.Login = $w.controls.UIForm.extend({

    template : 'login_login',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        this._super();
        this.$el.hide();
        //$w.events.trigger($w.events.USER_LOGGING_ERROR, error);
    },


    afterRender : function(){
        this._super();
        this.auth = $w.Application.auth();
        this.$el.show();

        //auth.login('twitter');
        //auth.login('facebook');
        //auth.login('github');
        //auth.login('password');

    },

    errorHandler : function(response){
        this.$('.form_errors').html('The email or password you entered is incorrect.');
    }

});