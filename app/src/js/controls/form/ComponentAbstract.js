$w.controls.ComponentAbstract = $w.views.Abstract.extend({
    
    template : 'form_formelement',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        if( !this.model ){
            throw 'Model is required';
        }   
        this.$markup = this.$el.clone();
        this.field = this.$el.attr('name');
        this.form = this.options.form;
        this.$form = this.form.$el;
        
        if( !this.field ){
            throw 'Name is required for UI controls';
        }
        
        this.$el.addClass( this.field );
        
        this.model.on($w.events.FORM_INVALID + ':' + this.field, this.validationErrorHandler);
        this.model.on('change:' + this.field, this.modelFieldChangeHandler);
    },
    
    getViewData : function(){
        
        var data = {};
        if( this.model ){
        }
        
        data.field = this.field;
        
        return data;
    },
    
    validationErrorHandler : function(msg){
        this.addError(msg);
    },
    
    addError : function(msg){
        if( !this.$control ){
            return null;
        }
        this.$control.addClass('validation-error');
        this.$('.validation-message').html(msg);
    },

    inputChangeHandler : function(){
        this.inputBind = true;
        this.controlValueToModel();
        this.inputBind = false;
    },

    controlValueToModel : function(){
        this.model.set( this.field, this.$control.val() );
    },

    modelValueToControl : function(){
        this.$control.val( this.model.get(this.field) );
    },

    modelFieldChangeHandler : function(){
        if( this.inputBind ){
            return null;
        }
        this.modelValueToControl();
    },
    
    removeError : function(){
        if( !this.$control ){
            return null;
        }
        this.$control.removeClass('validation-error');
        this.$('.validation-message').html('');
    },
    
    beforeRender : function(){
    },
    
    afterRender : function(){
        this.$label = this.$('label');
        this.$('.control-container').html(this.getControl());

        this.validateControlId();
        this.validateLabel();

        this.modelValueToControl();
    },
    
    getControl : function(){
       this.validateControl();
       return this.$control; 
    },
    
    validateControl : function(){
        if( !this.$control ){
            this.invalidateControl();
        }
    },
    
    invalidateControl : function(){
        var template = this.getControlTemplate();
        this.$control = $(template);
        return this.$control;
    },

    getControlTemplate : function(){
        throw 'You should overwrite this';
    },
    
    enable : function(){
       this.$control.attr("disabled",""); 
    },
    
    disable : function(){
       this.$control.attr("disabled","disabled"); 
    },

    validateLabel : function(){
        if( $w.util.isEmpty( this.$label.attr('for') ) ){
            this.$label.attr('for', this.$control.attr('id'));
        }
        if( this.$markup.attr('label') ){
            this.$label.text(this.$markup.attr('label'));
        }
    },

    validateControlId : function(){
        if( !this.$control ){
            throw 'setControlId should be called after $control is defined';
        }

        if( !$w.util.isEmpty(this.$control.attr('id')) ){
            return null;
        }

        this.invalidateControlId();
    },

    invalidateControlId : function(){
        if( this.$markup.attr('id') ){
            this.$control.attr('id', this.$markup.attr('id'));

        }else{
            var id = 'checkbox_' + new Date().getTime();
            id += Math.round(Math.random() * 100);
            this.$control.attr('id', id);
        }
    }

});