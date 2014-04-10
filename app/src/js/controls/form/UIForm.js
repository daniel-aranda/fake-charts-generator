$w.controls.UIForm = $w.views.Abstract.extend({
    
    controls : {},
    enabled : true,

    events : function(events){
        var this_events = {
            'click button[type="submit"]' : 'submitClickHandler'
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        if( !this.model ){
            throw 'Model is required';
        }   
    },
    
    afterRender : function(){
        this.$('.ui-control').each(this.createControl);
    },
    
    resetValidations : function(){
        this.$('.validation-message').html('');
        this.$('.ui-control input').removeClass('validation-error');
        this.$('.ui-control textarea').removeClass('validation-error');
    },
    
    validate : function(){
        this.resetValidations();
        
        return this.model.validateInput();
    },
    
    createControl : function(index, element){
        var control = this.controlFactory(element);
    },
    
    controlFactory : function(element){
        var $element = $(element);
        var control;

        var options = {
            model : this.model,
            el : $element,
            form : this
        };
        
        if( $element.hasClass("textfield") ){
            control = this.createTextField($element, options);
        }
        if( $element.hasClass("textarea") ){
            control = this.createTextArea($element, options);
        }
        if( $element.hasClass("checkbox") ){
            control = this.createCheckBox($element, options);
        }
        if( $element.hasClass("radiobutton") ){
            control = this.createRadioButton($element, options);
        }

        if( !control ){
            throw 'Uknown component: ' + $element[0].className;
        }
        control.render();
        this.controls[ control.field ] = control;
    },
    
    createTextField : function($element, options){
        return new $w.controls.TextField(options);
    },
    
    createTextArea : function($element, options){
        return new $w.controls.TextArea(options);
    },
    
    createCheckBox : function($element, options){
        return new $w.controls.CheckBox(options);
    },

    createRadioButton : function($element, options){
        return new $w.controls.RadioButton(options);
    },

    enable : function(){
       _.each(this.controls, function(control){
           control.enable();
       } , this);
       this.enabled = true;
    },
    
    disable : function(){
       _.each(this.controls, function(control){
           control.disable();
       } , this);
       this.enabled = false;
    },
    
    submitClickHandler : function(){
        
        if( !this.enabled ){
            return false;
        }
                
        if( !this.validate() ){
            return null;
        }

        this.onSubmit();
    },
    
    onSubmit : function(){
    }

});