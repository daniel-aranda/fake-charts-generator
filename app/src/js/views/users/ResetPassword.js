$w.views.users.ResetPassword = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'enter .password' : 'submitClickHandler',
           'enter .confirm_password' : 'submitClickHandler',
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_reset-password',
    
    afterRender : function(){
        this._super();
        this.$el.hide();
        this.validateHash();
    },
    
    validateHash : function(){
        $w.getJSON({
            url : $w.global.apiUrl + 'login/validate_hash',
            success : this.validateHashHandler
        });
    },
    
    validateHashHandler : function(response){
        if( response.valid ){
            this.$el.show();
            this.controls.password.$control.focus();
        }else{
            $w.global.router.go('validate-hash');
        }
    },
    
    onSubmit : function(){
        this.model.save(null,{
            success : this.responseHandler
        });
    },
    
    responseHandler : function(){
        $w.global.router.go('login');
    }
    
});