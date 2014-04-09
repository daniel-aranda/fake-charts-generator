$w.controls.TextField = $w.controls.ComponentAbstract.extend({

    events : function(events){
        var this_events = {
            'input input' : this.inputChangeHandler,
            'keyup input' : this.keyUpHandler
        };
        return this._super(_.extend(this_events, events));
    },
    
    keyUpHandler : function(e){
        if( e.which == 13 ){
            this.$el.trigger('enter');
        }
    },
    
    invalidateControl : function(){
        this._super();
        if( this.$markup.attr('type') ){
            this.$control.attr('type', this.$markup.attr('type'));
        }
        return this.$control;
    },

    getControlTemplate : function(){
        return $w.tpl.getTemplate('form_textfield');
    }


});