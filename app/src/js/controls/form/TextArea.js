$w.controls.TextArea = $w.controls.ComponentAbstract.extend({

    events : function(events){
        var this_events = {
            'change textarea' : this.inputChangeHandler,
            'input textarea' : this.inputChangeHandler
        };
        return this._super(_.extend(this_events, events));
    },
    
    invalidateControl : function(){
        var template = $w.tpl.getTemplate('form_textarea');
        this.$control = $(template);
        return this.$control;
    }

});