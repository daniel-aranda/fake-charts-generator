$w.controls.RadioButton = $w.controls.ComponentAbstract.extend({

    events : function(events){
        var this_events = {
            'change input' : this.inputChangeHandler
        };
        return this._super(_.extend(this_events, events));
    },

    afterRender : function(){
        this._super();

        if( !this._rendered ){
            this.$el.prepend('<div class="left-wrapper" />');
            this.$('.control-container').after(this.$label);
        }
    },

    controlValueToModel : function(){
        this.model.set( this.field, this.$control.is(':checked') );
    },

    modelValueToControl : function(){
        if( this.model.get(this.field) ){
            this.$control.prop('checked', true);
        }else{
            this.$control.prop('checked', false);
        }
    },

    getControlTemplate : function(){
        return $w.tpl.getTemplate('form_radiobutton');
    }

});