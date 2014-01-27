$w.views.UserRegister = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_register',
    
    submitClickHandler : function(){
        
        if( !this.validate() ){
            return null;
        }
        
        this.model.save();
    }
    
});