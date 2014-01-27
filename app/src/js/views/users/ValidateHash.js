$w.views.users.ValidateHash = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_validate-hash',
    
    afterRender : function(){
        this._super();
        this.controls['hash'].$control.focus(); 
        //this.disable();
    },
    
    onSubmit : function(){
        
        this.model.save(null,{
            success : this.responseHandler
        });
    },
    
    responseHandler : function(model, response){
        if(response.valid){
            $w.global.router.go('reset-password');
        }else{
            this.$('.form_errors').html('Invalid hash, please verify it.');
        }
    }
    
});