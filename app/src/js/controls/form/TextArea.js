$w.controls.TextArea = $w.controls.ComponentAbstract.extend({

    events : function(events){
        var this_events = {
            'change textarea' : this.inputChangeHandler,
            'input textarea' : this.inputChangeHandler
        };
        return this._super(_.extend(this_events, events));
    },
    
    getControlTemplate : function(){
        return $w.tpl.getTemplate('form_textarea');
    }

});