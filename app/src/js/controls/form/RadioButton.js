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
        if( this.$control.is(':checked') ){
            var value = this.$control.val();
            this.model.set( this.field,  value);
        }
    },

    modelValueToControl : function(){
        if( this.model.get(this.field) && this.model.get(this.field) == this.$control.val() ){
            this.$control.prop('checked', true);
        }else{
            this.$control.prop('checked', false);
        }
    },

    invalidateControl : function(){
        this._super();

        if( !this.$markup.attr('value') ){
            throw 'Attribute value is required for RadioButtons';
        }

        this.$control.attr('name', this.$markup.attr('name'));
        this.$control.attr('value', this.$markup.attr('value'));
        return this.$control;
    },

    getControlTemplate : function(){
        return $w.tpl.getTemplate('form_radiobutton');
    }

});