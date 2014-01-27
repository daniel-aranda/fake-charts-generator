$w.controls.CheckBox = $w.controls.ComponentAbstract.extend({

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
            if( $w.util.isEmpty( this.$label.css('for') ) ){
                this.setControlId();
                this.$label.attr('for', this.$control.attr('id'));
            }
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

    invalidateControl : function(){
        var template = $w.tpl.getTemplate('form_checkbox');
        this.$control = $(template);
        if( this.$markup.attr('label') ){
            this.$label.html(this.$markup.attr('label'));
        }
        return this.$control;
    },

    setControlId : function(){
        if( !$w.util.isEmpty(this.$control.attr('id')) ){
            return null;
        }
        var id = 'checkbox_' + new Date().getTime();
        id += Math.round(Math.random() * 100);
        this.$control.attr('id', id);
    }

});