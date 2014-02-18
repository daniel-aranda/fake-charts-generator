$w.views.users.ForgotPassword = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'enter .email' : 'submitClickHandler',
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_forgot-password',
    
    afterRender : function(){
        this._super();
        this.controlsemail.$control.focus();
    },
    
    submitClickHandler : function(){
        
        if( !this.validate() ){
            return null;
        }
        
        this.model.save(null,{
            success : this.responseHandler
        });
    },
    
    responseHandler : function(){
        $w.global.router.go('reset-password');
    }
    
});