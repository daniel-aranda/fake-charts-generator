/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/main.js*/
'use strict';

window.FakeChartsGenerator = typeof FakeChartsGenerator != 'undefined' ? FakeChartsGenerator : {};

window.$w = FakeChartsGenerator;

var packages = {
    users : {}
};

$w.models = JSON.parse(JSON.stringify(packages));
$w.views = JSON.parse(JSON.stringify(packages));
$w.collections = JSON.parse(JSON.stringify(packages));

$w.controls = {};

$w.core = {

    setup : function(scripts, callback){
        this.ajaxSetup();
        this.errorHandlerSetup();
        $('body').on('keyup', this.onKeyUpHandler);
    },
    
    /**
     * Setup ajaxError. Helpful to instantiate it only one time and also have a 
     * custom event to handle the error, if needed.
     * 
     */
    ajaxSetup : function(){
        
        if( this.ajaxInstalled ){
            return false;
        }
        
        this.ajaxInstalled = true;
        
        $( document ).ajaxError(function(event, jqxhr, settings, exception) {
            if(exception == 'Unauthorized'){
                //TODO: enable login throw AJAX
                document.location.reload(true);
            }else{
                $w.events.trigger($w.events.AJAX_ERROR, event, jqxhr, settings, exception);
            }
        });
        
        $( document ).ajaxSend(function(event, jqxhr, settings) {
            $w.events.trigger($w.events.AJAX_BEFORE_SEND, event, jqxhr, settings);
        });
        $( document ).ajaxComplete(function(event, jqxhr, settings) {
            $w.events.trigger($w.events.AJAX_SEND_COMPLETED, event, jqxhr, settings);
        });
    },
    
    errorHandlerSetup : function(){
        window.onerror = function(message, url, linenumber){
            if( message == 'Script error.' ){
                console.log(message, url, linenumber);
            }
        };
    },
    
    onKeyUpHandler : function(e){
        $w.events.trigger($w.events.KEY_UP, e);
    }
};



/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/events.js*/
$w.events = {
    AJAX_ERROR : 'AJAXErrorEvent',
    AJAX_BEFORE_SEND : 'AJAXBeforeSendEvent',
    AJAX_SEND_COMPLETED : 'AJAXAfterSendEvent',
    KEY_UP : 'KeyUpEvent',
    USER_LOGGED : 'UserLoggedEvent',
    USER_LOGGING_ERROR : 'UserLoggingErrorEvent',
    USER_LOGOUT : 'UserLogOutEvent',
    FORM_INVALID : 'FormInvalidEvent'
};
   
_.extend($w.events, Backbone.Events);

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/globals.js*/
$w.global = {
    dataCenterUrl : '/api/',
    apiUrl : '/api/'
};

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/helpers.js*/

$w.postJSON = function(settings){
    var settings = _.extend({
        type: "POST",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.getJSON = function(settings){
    var settings = _.extend({
        type: "GET",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.asset = function(path){
    return $w.global.assetsUrl + path;  
};

$w.image = function(path, className){
    return '<img src="' + $w.asset('img/' + path) + '" class="' + className + '" />';  
};

$w.button = function(label, className, type){
    type = type || 'button';
    className = className || '';
    className += ' component-button';
    return '<button type="' + type + '" class="' + className + '">' + label + '</button>';  
};
$w.submitButton = function(label, className, type){
    return $w.button(label, className, 'submit');  
};
$w.cancelButton = function(label, className){
    label = label || 'cancel';
    className = className || '';
    className += ' cancel-button';
    return $w.button(label, className);  
};


/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/template.js*/

/**
 * 
 * danielarandaochoa.com
 * Template Library
 * ::::::::::::::::::::::::::::
 * 
 * Use this library to load external templates to your module. The logic is to store HTML templates into packages. 
 *      One package per module and also one package for commons. The path to store the templates is:
 *      /assets/templates/{package}.html
 *      Package will contain templates in this way:
 *      <script class="tpl{TemplateName}" type="text/x-Sailthru-tpl">
 *          This is a containg for a Template
 *      </script>
 * 
 *      To get a Template use:
 *      $s.tpl.getTemplate('campaigns', 'drafts-list', data);
 * 
 *      Real worl example to get the template for the Package "Campaigns" and the template "drafts-list"
 *      $s.tpl.getTemplate('campaigns', 'drafts-list', data);  
 * 
 * @author: Daniel Aranda
 * 
 * @since: 2.0
 * 
 */

$w.tpl = {
    
    templatesPath : '',
    
    templates : {},
    
    compiledTemplates : {},
    
    loadTemplates : function(templateUrl){
        
        $.ajax({
            url: templateUrl,
            context: this,
            async: false,
            success: function(templateRaw) { 
                this.templates = $('<div />').append(templateRaw);
                this.templatesLoaded = true;
            },
            error: function(){
                console.log('Error loading this template: ' + templateFile);
            }
        });
         
    },
    
    getTemplate : function(name, data){
        
        if( !this.templatesLoaded ){
            throw 'Templates should be loaded first';
        }
        
        if( !this.compiledTemplates[name] ){
            var templateDom = this.templates.find( '.tpl.' + name);
            
            if( templateDom.length === 0 ){
                console.log('Template Not Found.', arguments);
                return 'Template Not Found.';
            }
            if( templateDom.length > 1 ){
                console.log(arguments);
                console.log('You defined more than one template with the same name. Please make sure each template has a unique name.');
            }
            try{
                this.compiledTemplates[name] = _.template( templateDom.html() );
            }catch(e){
                console.log('Error preparing the template: ' + e.message);
                console.log('Template: ', arguments);
            }
        }
        
        var template = this.compiledTemplates[name];  
        
        try{
            var result = template(data);
        }catch(e){
            console.log('Error rendering the template: ' + e.message);
            console.log('Template: ', arguments);
        }
         
        return result;
    }
    
};

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/core/util.js*/
$w.util = {
    
    clone : function(target){
        return JSON.parse(JSON.stringify(target));  
    },
    
    /**
     * $s.util.isSet(value)
     * Some kind of equivalent to PHP isset, we verify the type of the var and return true only if it is different than null or undefined
     * 
     */
    isSet : function(value){
      
      var isValue = true;
      
      switch(typeof value){
          case "undefined":
            isValue = false;
            break;
          case "object":
            isValue = value !== null;
            break;
      }
      
      return isValue;  
    },
    
    /**
     * $s.util.isSet(value)
     * Some kind of equivalent to PHP empty, we verify the content of the var and return true only if it is equal to '', null or undefined
     * 
     */
    isEmpty : function(value){
        if( !this.isSet(value) ){
            return true;
        }
        if( typeof value == "string" ){
            return value.length === 0;
        }
        return false;
    },
    
    nl2br : function(str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    
    bindAll : function(target){
        if( !target || typeof target != 'object'){
            return null;
        }
        
        for(var i in target){
            if( typeof target[i] == 'function' ){
                target[i] = _.bind(target[i], target);
            }
        };
        
    },
    
    pos : function($item, top, left){
        $item.css('top', top + 'px'); 
        $item.css('left', left + 'px'); 
    },
    
    ajaxErrorMessage : function(request){
        var msg = '';
        try{
            var responseJson = $.parseJSON( request.responseText );
            msg = ' ' + responseJson.error_detail.error_message;
        }catch(e){
        }
        return msg;
    }
    
};


/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/Abstract.js*/
$w.models.Abstract = Backbone.Model.extend({

    validations : null,

    initialize : function(){
        $w.util.bindAll(this);
    },
    
    urlRoot : function(){
        return $w.global.apiUrl + this.serviceUrl;  
    },
    
    validateInput: function(attrs, options) {
        var valid = true;
        _.each(this.validations, function(validations, key){
            valid = this.validateField(validations, key);
        }, this);
        
        return valid;
    },

    validateField : function(validations, key){
        var valid = true;
        if(validations.required && validations.required[0]){
            if( $w.util.isEmpty(this.get(key)) ){
                valid = false;
                var msg = validations.required[1] ? validations.required[1] : key + ' is required';
                this.trigger($w.events.FORM_INVALID + ':' + key, msg);
            }
        }
        if(validations.confirm && validations.confirm[0]){
            if( this.get(key) && this.get(key) != this.get(validations.confirm[0]) ){
                valid = false;
                var msg = validations.confirm[1] ? validations.confirm[1] : validations.confirm[0] + " isn't the same than " + key;
                this.trigger($w.events.FORM_INVALID + ':' + validations.confirm[0], msg);
            }
        }
        return valid;
    }
        
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/Abstract.js*/
$w.views.Abstract = Backbone.View.extend({
        
        packageName : null,
        template : null,
        _rendered : false,

        initialize : function(){
            $w.util.bindAll(this);
            this.afterInitialize();
        },
        
        events : function(events){
            return events;
        },
        
        getTemplate : function(template, data){
            var template = $w.tpl.getTemplate(template, data);
            this.$el.html(template);
        },
        
        render : function(){
            
            if( !this.template ){
                throw 'template is required in order to proper render';
            }

            this.beforeRender();

            this.getTemplate(this.template, this.getViewData());  
            
            this.afterRender();

            this._rendered = true;
        },
        
        getViewData : function(){
            if( this.model ){
                return this.model.toJSON();
            }  
            return null;
        },
        
        afterInitialize : function(){
        },
        
        beforeRender : function(){
        },
        
        afterRender : function(){
        }
          
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/form/ComponentAbstract.js*/
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
        throw 'You should replace this in the child class';
    },
    
    enable : function(){
       this.$control.attr("disabled",""); 
    },
    
    disable : function(){
       this.$control.attr("disabled","disabled"); 
    }

});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/form/CheckBox.js*/
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

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/form/TextArea.js*/
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

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/form/TextField.js*/
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
        var template = $w.tpl.getTemplate('form_textfield');
        this.$control = $(template);
        if( this.$markup.attr('type') ){
            this.$control.attr('type', this.$markup.attr('type'));
        }
        return this.$control;
    }

});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/form/UIForm.js*/
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
            el : $element
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

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/popup/alert.js*/
$w.views.Alert = $w.views.Abstract.extend({
    
    template : 'popup_alert',
    className : 'window_alert',
    callback : null,
    
    events : {
        'click button[type="submit"]' : 'closeClickHandler'
    },
    
    afterInitialize : function(){
        this.callback = this.options.callback;
        this.on('PopUpKeyPress', this.popupKeyPressHandler);
    },
    
    afterRender : function(){
        this.$('.component-button').focus();  
    },
    
    popupKeyPressHandler : function(e){
        if( e.keyCode == 13 ){
            $w.popup.close();
        }
    },
    
    closeClickHandler : function(){
        $w.popup.close();
        if( this.callback ){
            this.callback();
        }
    }
    
});

$w.models.Alert = Backbone.Model.extend({
    defaults : {
        content : '',
        button_label : 'OK' 
    }
});

$w.alert = function(message, callback){

    var alertModel = new $w.models.Alert({
        content : message
    });
    
    var alertView = new $w.views.Alert({
        model : alertModel,
        callback : callback
    });
    
    var options = {
        title : 'Alert',  
        width : 350 
    };
     
    $w.popup.open(alertView, options);
    alertView.render();
};

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/popup/overlay.js*/
/**
 * 
 * Sailthru UI 2.0
 * Overlay
 * ::::::::::::::::::::::::::::
 * 
 * Utility to create an overlay overy your page. 
 * 
 * @author: Daniel Aranda
 * 
 * @since: 2.0
 * 
 */

$w.overlay = {
    
    element : '#overlay',
    
    options : {},
    
    open : function(options){
        
        options = options || {};
        this.options = options;
        
        if( this.options.animate ){
            $($w.overlay.element).fadeIn('300');
        }else{
            $($w.overlay.element).show();
        }
            
    },
    
    close : function(){
        if( this.options.animate ){
            $($w.overlay.element).fadeOut('200');
        }else{
            $($w.overlay.element).hide();
        }
    }
    
};

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/controls/popup/popup.js*/
/**
 * 
 * Sailthru UI 2.0
 * PopUpManager
 * ::::::::::::::::::::::::::::
 * 
 * Utility to create popups. 
 * 
 * @author: Daniel Aranda
 * 
 * @since: 2.0
 * 
 */

$w.popup = {
    
    _initialized : false,
    window : null,
    previewsWindows : [],
    popupWrapper : null,
    
    initialize : function(){
        if( this._initialized ){
            return false;
        }
        
        $w.util.bindAll(this);
        $w.events.on($w.events.KEY_UP, this.onKeyUpHandler);
        this._initialized = true;
        
        if( !this.popupWrapper ){
            this.popupWrapper = $('body');
        } 
    },
    
    /**
     * Open a popup for a given HTML
     * Currently we do not support multiple popups, so if you open a popup and there is other opened we will close
     */
    open : function(popUpContent, options){
        
        this.initialize();      
        
        options = options || {};
        $w.overlay.open(options);
        
        if( this.window ){
            this.previewsWindows.push( this.window );
            this.window.$el.css('opacity', '0.85');
            this.window.$el.css('pointer-events', 'none');
        }else{
            $('html').css('overflow', 'hidden');
        }
        
        var model = new $w.models.PopUpWindow( options );
        this.window = new $w.views.PopUpWindow( {model : model} );
        this.popupWrapper.append(this.window.el);
        this.window.contentView = popUpContent;
        this.window.model.set({
            content : popUpContent.el 
        });
        this.window.render();
        
        
        if( options.animate ){
            this.window.$el.hide();
            setTimeout(this.animateWindow, 600);    
        }
        
        return this.window;
    },
    
    animateWindow : function(){
        if( this.window ){
            this.window.$el.fadeIn(null, null, this.animateCompleted);  
        }
    },
    
    animateCompleted : function(){
        if( this.window && this.window.model.get('callback')){
            var callback = this.window.model.get('callback');
            callback();  
        }
    },
    
    close : function(target){
        if( !target ){
            this.removeActiveWindow();
        }else{
            this.removeWindow(target);
        }
    },
    
    removeWindow : function(target){
        if( this.window == target){
            this.removeActiveWindow();
        }else{
            if( this.previewsWindows.length == 0 ){
                return false;
            }
            this.previewsWindows = _.filter(this.previewsWindows, function(item){
                if( item == target ){
                   item.remove(); 
                }
                return item != target;
            }, this);
        }
    },
    
    removeActiveWindow : function(){
        
        if( this.window ){
            this.window.unbind();
            this.window.remove();
            this.window = null;
        }
        this.invalidatePendingWindows();
    },
    
    invalidatePendingWindows : function(){
        if( this.previewsWindows.length > 0 ){
            this.window = this.previewsWindows.pop();
            this.window.$el.css('opacity', '1');
            this.window.$el.css('pointer-events', 'all');
            this.animateCompleted();          
        }else{
            $('html').css('overflow', 'auto');
            $w.overlay.close();
        }
    },
    
    onKeyUpHandler : function(e){
        if( this.window ){
            this.window.trigger('PopUpKeyPress', e);
            this.window.contentView.trigger('PopUpKeyPress', e);
            if( e.keyCode == 27 ){
                $w.popup.close();
            }
        }
    }
    
};

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/app/Router.js*/
$w.Router = Backbone.Router.extend({
    
    routes : {
        "login"                         : "loginView",   
        "register"                      : "registerView",   
        "forgot-password"               : "forgotPasswordView",   
        "reset-password"                : "resetPasswordView",   
        "validate-hash"                 : "validateHashView",   
        "logout"                        : "logoutView",   
        "start"                         : "startView",   
        "project"                       : "projectView",   
        "*path"                         : "defaultRoute"   
    },

    defaultRoute : function() {
        this.go('start');
    },
    
    loginView : function(){
        var model = new $w.models.User();
        var view = new $w.views.Login({model : model});
        $w.Application.login(view);
    },
    
    registerView : function(){
        var model = new $w.models.User();
        var view = new $w.views.UserRegister({model : model});
        $w.Application.guestDisplay(view);
    },
    
    forgotPasswordView : function(){
        var model = new $w.models.users.ForgotPassword();
        var view = new $w.views.users.ForgotPassword({model : model});
        $w.Application.guestDisplay(view);
    },
    
    resetPasswordView : function(){
        var model = new $w.models.users.ResetPassword();
        var view = new $w.views.users.ResetPassword({model : model});
        $w.Application.guestDisplay(view);
    },
    
    validateHashView : function(){
        var model = new $w.models.users.ValidateHash();
        var view = new $w.views.users.ValidateHash({model : model});
        $w.Application.guestDisplay(view);
    },
    
    logoutView : function(){
        var view = new $w.views.Logout();
        $w.Application.login(view);
    },
    
    startView : function(){
        var view = new $w.views.Start();
        this.view(view);
    },
    
    projectView : function(){
        var view = new $w.views.ProjectIndex();
        this.view(view);
    },
    
    view : function(view){
        $w.Application.display(view);
    },
    
    go : function(section){
        this.navigate(section, {trigger: true});
    }

});
    

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/Main.js*/
$w.models.Main = $w.models.Abstract.extend({

});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/PopUpWindow.js*/
$w.models.PopUpWindow = $w.models.Abstract.extend({
    
    defaults : {
        title : 'Untitled',
        custom_template : null  
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/User.js*/
$w.models.User = $w.models.Abstract.extend({
    
    serviceUrl : 'users',
    
    defaults : {
        email : '',  
        password : '',  
        first_name : '',  
        last_name : ''  
    },
    
    validations :{
        email : {
            required : [true]
        },  
        password : {
            required : [false]
        }  
    },
    
    getShortName : function(){
        var name;
        name = this.get('first_name');
        name += ' ';
        name += this.get('last_name') ? this.get('last_name').substring(0,1) + '.' : '';
        return name;
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/users/ForgotPassword.js*/
$w.models.users.ForgotPassword = $w.models.Abstract.extend({
    
    serviceUrl : 'login/reset_password_email/',
    
    defaults : {
        email : ''
    },
    
    validations :{
        email : {
            required : [true]
        }
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/users/ResetPassword.js*/
$w.models.users.ResetPassword = $w.models.Abstract.extend({
    
    serviceUrl : 'login/update_password/',
    
    defaults : {
        password : '',
        confirm_password : ''
    },
    
    validations :{
        password : {
            required : [true],
            confirm : ['confirm_password']
        }
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/models/users/ValidateHash.js*/
$w.models.users.ValidateHash = $w.models.Abstract.extend({
    
    serviceUrl : 'login/validate_hash/',
    
    defaults : {
        hash : ''
    },
    
    validations :{
        hash : {
            required : [true]
        }
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/commons/Footer.js*/
$w.views.Footer = $w.views.Abstract.extend({

    events : {
    },

    template : 'commons_footer'
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/commons/Header.js*/
$w.views.Header = $w.views.Abstract.extend({

    events : {
    },
    
    template : 'commons_header',
    
    getViewData : function(){
        var name = '';
        if( $w.Application.user() ){
            name = $w.Application.user().getShortName(); 
        }
        
        var data = {
            name : name
        };
        return data;
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/Login.js*/
$w.views.Login = $w.controls.UIForm.extend({

    template : 'login_login',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        this._super();
        this.$el.hide();
        //$w.events.trigger($w.events.USER_LOGGING_ERROR, error);
    },


    afterRender : function(){
        this._super();
        this.auth = $w.Application.auth();
        this.$el.show();

    },

    errorHandler : function(response){
        this.$('.form_errors').html('The email or password you entered is incorrect.');
    }

});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/Logout.js*/
$w.views.Logout = $w.views.Abstract.extend({

    events : {
    },

    template : 'login_logout',
    
    afterRender : function(){
        this.auth = $w.Application.auth();
        this.auth.logout();
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/Main.js*/
$w.views.Main = $w.views.Abstract.extend({

    template : 'layout_default',
    
    appendViewHandler : null,
    headerFooterRendered : false,
    
    ajaxRequestsQueue : 0,
    
    afterInitialize : function(){
        this.header = new $w.views.Header();  
        this.footer = new $w.views.Footer();  
        
        $w.events.on($w.events.AJAX_BEFORE_SEND, this.beforAjaxSendHandler);
        $w.events.on($w.events.AJAX_SEND_COMPLETED, this.sendCompletedHandler);
        $w.events.on($w.events.AJAX_ERROR, this.ajaxErrorHandler);
    },
    
    guestDisplay : function(view){
        this.headerFooterRendered = false;
        this.appendViewHandler = this.appendViewNotLogged;
        this.appendView(view);
    },
    
    display : function(view){
        this.validateHeaderFooter();
        this.appendViewHandler = this.appendViewDefault;
        this.appendView(view);
    },
    
    validateHeaderFooter : function(){
        if( this.headerFooterRendered ){
            return false;
        }
        
        this.render();
        this.$header.html(this.header.el);
        this.$footer.html(this.footer.el);
        this.header.render();
        this.footer.render();
        
        this.headerFooterRendered = true;
    },
    
    appendView : function(view){
        this.appendViewHandler(view);
        view.render();
    },
    
    afterRender : function(){
        this.$header = this.$('.header-holder');  
        this.$content = this.$('.content-holder');  
        this.$footer = this.$('.footer-holder');  
        this.$loader = this.$('#loader');
    },
    
    appendViewNotLogged : function(view){
        this.$header.empty();
        this.$footer.empty();
        this.$content.html(view.el);
    },
    
    appendViewDefault : function(view){
        this.$content.html(view.el);
    },
    
    beforAjaxSendHandler : function(event, jqxhr, settings){
        if( settings.disableAppLoader ){
            return null;
        }
        this.$loader.show();
        this.ajaxRequestsQueue++;
    },
    
    sendCompletedHandler : function(event, jqxhr, settings){
        if( settings.disableAppLoader ){
            return null;
        }
        this.ajaxRequestsQueue--;
        this.ajaxRequestQueue = this.ajaxRequestQueue < 0 ? 0 : this.ajaxRequestQueue; 
        if( this.ajaxRequestsQueue === 0 ){
            this.$loader.hide();
        }
    },
    
    ajaxErrorHandler : function(event, jqxhr, settings, exception){
        if( !settings.customErrorHandler ){
            var errorMsg = $w.util.ajaxErrorMessage(jqxhr);
            if( $w.util.isEmpty(errorMsg) ){
                $w.alert('There was an error processing your request. Please try again.');
            }else{
                $w.alert(errorMsg);
            }
        }
    },
    
 
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/PopUpWindow.js*/
$w.views.PopUpWindow = $w.views.Abstract.extend({
    
    className : 'window fcg-ui',
    template : 'popup_window',
    
    events : {
        'click .window_close' : 'closeClickHandler'
    },
    
    initialize : function(){
        $w.util.bindAll(this);
    },
    
    beforeRender : function(){

        if( this.model.get('custom_template') ){
            this.template = this.model.get('custom_template');
        }
        
    },
    
    afterRender : function(){
        
        this.$el.draggable({
            cancel: ".window_close",
            handle: ".window_header",
        });
        this.$('.window_content').html( this.model.get('content') );
        
        this.invalidateSize();
        this.invalidatePosition();
        
    },
    
    invalidateSize : function(){
        if( this.model.get('width') ){
            this.$el.width(this.model.get('width'));
        }    
        if( this.model.get('height') ){
            this.$('.window_content').height(this.model.get('height'));
        }    
    },
    
    invalidatePosition : function(){
        
        var top = ($(window).height() - this.$el.height())/ 4;
        var left = ($(window).width() - this.$el.width())/ 2;
        
        if( top < 0 ){
            top = 10;
        }
        if( left < 0 ){
            left = 10;
        }
        
        this.$el.css('top', top + 'px');
        this.$el.css('left', left + 'px');
    },
    
    closeClickHandler : function(){
        $w.popup.close();
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/project/ProjectIndex.js*/
$w.views.ProjectIndex = $w.views.Abstract.extend({

    template : 'project_index'
 
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/Start.js*/
$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start'
 
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/users/ForgotPassword.js*/
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
        this.controls['email'].$control.focus();  
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

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/users/ResetPassword.js*/
$w.views.users.ResetPassword = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'enter .password' : 'submitClickHandler',
           'enter .confirm_password' : 'submitClickHandler',
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_reset-password',
    
    afterRender : function(){
        this._super();
        this.$el.hide();
        this.validateHash();
    },
    
    validateHash : function(){
        $w.getJSON({
            url : $w.global.apiUrl + 'login/validate_hash',
            success : this.validateHashHandler
        });
    },
    
    validateHashHandler : function(response){
        if( response.valid ){
            this.$el.show();
            this.controls['password'].$control.focus();
        }else{
            $w.global.router.go('validate-hash');
        }
    },
    
    onSubmit : function(){
        this.model.save(null,{
            success : this.responseHandler
        });
    },
    
    responseHandler : function(){
        $w.global.router.go('login');
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/users/UserRegister.js*/
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

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/views/users/ValidateHash.js*/
$w.views.users.ValidateHash = $w.controls.UIForm.extend({

    events : function(events){
        var this_events = {
           'click .submit' : 'submitClickHandler' 
        };
        return this._super(_.extend(this_events, events));
    },
    
    template : 'user_validate-hash',
    
    afterRender : function(){
        this._super();
        this.controls['hash'].$control.focus(); 
        //this.disable();
    },
    
    onSubmit : function(){
        
        this.model.save(null,{
            success : this.responseHandler
        });
    },
    
    responseHandler : function(model, response){
        if(response.valid){
            $w.global.router.go('reset-password');
        }else{
            this.$('.form_errors').html('Invalid hash, please verify it.');
        }
    }
    
});

/*File: C:\Users\Daniel Aranda\Documents\vhosts\fake-charts-generator\workflow/../app/src/js/app.js*/
$w.Application = (function (Backbone, _, $) {
    
    var public_scope = {
        initialize : initialize,
        display : display,
        guestDisplay : guestDisplay,
        login : login,
        user : user,
        auth : auth
    };
    
    var _initialized = false;
    var _lastProtectedView = null;
    var _mainView;
    var _user;
    var _auth;
    
    function initialize(){
        if( _initialized ){
            return true;
        }
        
        _initialized = true;
        
        $w.core.setup();
        
        invalidateMainView();
        
        setUpRouter();
        
    }
    
    function display(view){
        _lastProtectedView = view;
        if( user() ){
            displayProtected();
        }else{
            invalidateLogin();
        }
    }

    function displayProtected(){
        if( _lastProtectedView ){
            _mainView.display(_lastProtectedView);
        }else{
            $w.global.router.go('start');
        }
    }
    
    function login(view){
        if( user() ){
            $w.global.router.go('start');
            return null;
        }
        view.on($w.events.USER_LOGGED, onUserLogged);
        view.on($w.events.USER_LOGOUT, onUserLogOut);
        _mainView.guestDisplay(view);
    }
    
    function guestDisplay(view){
        _mainView.guestDisplay(view);
    }
    
    function setUser(user){
        _user = new $w.models.User(user);
    }
    
    function onUserLogged(loggedUser){
        setUser(loggedUser);
        defaultPageForLoggedUser();
    }

    function onUserLogOut(){
        $w.global.router.go('login');
    }
    
    function setUpRouter(){
        $w.global.router = new $w.Router();
        Backbone.history.start();
    }
    
    function invalidateMainView(){
        _mainView = new $w.views.Main({
            model : new $w.models.Main(),
            el : $('.view-holder')
        });
        _mainView.render();
    }
    
    function invalidateLogin(){
        if( _auth ){
            return null;
        }
        var endPoint = new Firebase('https://crackling-fire-4479.firebaseio.com');
        _auth = new FirebaseSimpleLogin(endPoint, loginLoadedHandler);

        // attempt to log the user in with your preferred authentication provider
        //auth.login('twitter');
        //auth.login('facebook');
        //auth.login('github');
        //auth.login('password');

    }

    function loginLoadedHandler(error, user) {
        if (user) {
            setUser(user);
            displayProtected();
            return null;
        }

        $w.global.router.go('login');
        $w.events.trigger($w.events.USER_LOGGING_ERROR, error);
    }

    function user(){
        return _user;
    }

    function auth(){
        invalidateLogin();
        return _auth;
    }

    return public_scope;
    
}(window.Backbone, window._, window.$));

