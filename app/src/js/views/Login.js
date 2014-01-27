$w.views.Login = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'enter .email' : 'submitClickHandler', 
           'enter .password' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        this.model.validations.password.required[0] = true;
        this.model.on('change:remember_password', this.rememberPasswordChangedHandler);
    },
    
    afterRender : function(){
        this._super();
        this.$el.hide();
        $w.getJSON({
            url : $w.global.apiUrl + 'login',
            success : this.statusCheckedHandler
        });
    },

    statusCheckedHandler : function(response){
        this.$el.show();
        if( response.remember_email ){
            this.model.set({
                email : response.remember_email,
                remember_email : true
            });
            this.currentRememberEmail = true;
            this.controls['password'].$control.focus();
        }else{
            this.currentRememberEmail = false;
            this.controls['email'].$control.focus();
        }
    },

    template : 'login_login',
    
    onSubmit : function(){

        $w.postJSON({
            url : $w.global.apiUrl + 'login',
            data: JSON.stringify(this.model.toJSON()),
            success : this.responseHandler,
            error : this.errorHandler
        });
    },
    
    responseHandler : function(response){
        var user = response;
        this.trigger($w.events.USER_LOGGED, user);
    },
    
    errorHandler : function(response){
        this.$('.form_errors').html('The email or password you entered is incorrect.');
    },

    rememberPasswordChangedHandler : function(){
        if( this.model.get('remember_password') ){
            this.controls['remember_email'].$control.prop('checked', true);
            this.controls['remember_email'].$control[0].disabled = true;
        }else{
            this.controls['remember_email'].$control.prop('checked', this.currentRememberEmail);
            this.controls['remember_email'].$control[0].disabled = false;
        }
    }
    
});