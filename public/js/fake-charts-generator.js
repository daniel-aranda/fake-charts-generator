window.FakeChartsGenerator = typeof FakeChartsGenerator != 'undefined' ? FakeChartsGenerator : {};

window.$w = FakeChartsGenerator;

var packages = {
    users : {},
    charts : {}
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
$w.global = {
    dataCenterUrl : '/api/',
    apiUrl : '/api/'
};

$w.postJSON = function(settings){
    settings = _.extend({
        type: "POST",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.getJSON = function(settings){
    settings = _.extend({
        type: "GET",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.asset = function(path){
    return $w.Config.assetsUrl() + path;
};

$w.image = function(path, className){
    className = className || '';
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
 *      <script class="tpl{TemplateName}" type="text/x-FCG-tpl">
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
        var result;

        try{
            result = template(data);
        }catch(e){
            console.log('Error rendering the template: ' + e.message);
            console.log('Template: ', arguments);
        }
         
        return result;
    }
    
};
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
        }
        
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
        var msg;
        if(validations.required && validations.required[0]){
            if( $w.util.isEmpty(this.get(key)) ){
                valid = false;
                msg = validations.required[1] ? validations.required[1] : key + ' is required';
                this.trigger($w.events.FORM_INVALID + ':' + key, msg);
            }
        }
        if(validations.confirm && validations.confirm[0]){
            if( this.get(key) && this.get(key) != this.get(validations.confirm[0]) ){
                valid = false;
                msg = validations.confirm[1] ? validations.confirm[1] : validations.confirm[0] + " isn't the same than " + key;
                this.trigger($w.events.FORM_INVALID + ':' + validations.confirm[0], msg);
            }
        }
        return valid;
    }
        
});
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
            template = $w.tpl.getTemplate(template, data);
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
        return $w.tpl.getTemplate('form_checkbox');
    }

});
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
/**
 * 
 * FCG UI 2.0
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
/**
 * 
 * FCG UI 2.0
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
            if( this.previewsWindows.length === 0 ){
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
$w.Config = (function (Backbone, _, $) {

    var public_scope = {
        assetsUrl : assetsUrl,
        server : server
    };

    var currentServer = 1;

    var bd = {
        server1 : 'https://crackling-fire-4479.firebaseio.com/'
    };

    function assetsUrl(){
        return '';
    }

    function server(){
        return bd['server' + currentServer];
    }

    return public_scope;

}(window.Backbone, window._, window.$));
$w.Router = Backbone.Router.extend({

    history : [],
    
    routes : {
        "login"                         : "loginView",   
        "register"                      : "registerView",   
        "forgot-password"               : "forgotPasswordView",   
        "reset-password"                : "resetPasswordView",   
        "validate-hash"                 : "validateHashView",   
        "logout"                        : "logoutView",   
        "start"                         : "startView",
        "initializing"                  : "initializingView",
        "new"                           : "newChart",
        "create-chart/:id"               : "createChart",
        "*path"                         : "defaultRoute"
    },

    initialize : function(){
        $w.util.bindAll(this);
    },

    defaultRoute : function() {
        this.go('start');
    },

    newChart : function(){
        if( !$w.Application.validateLogin() ){
            return null;
        }

        var c = new $w.collections.charts.Chart();
        var newChart = c.add({user_id : $w.Application.user().id})[0];
        this.go('create-chart/' + newChart.id);
    },

    createChart : function(id){
        if( !$w.Application.validateLogin() ){
            return null;
        }

        var chartModel = new $w.models.charts.RemoteChart({id : id});

        var view = new $w.views.charts.Editor({model : chartModel});
        this.view(view);
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

    initializingView : function(){
        if( !$w.Application.loginRequested() || $w.Application.user() ){
            this.defaultRoute();
        }else{
            var view = new $w.views.Initializing();
            $w.Application.guestDisplay(view);
        }
    },

    view : function(view){
        $w.Application.display(view);
    },
    
    go : function(section){
        this.navigate(section, {trigger: true});
    }

});
$w.models.Main = $w.models.Abstract.extend({

});
$w.models.PopUpWindow = $w.models.Abstract.extend({
    
    defaults : {
        title : 'Untitled',
        custom_template : null  
    }
    
});
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

    getKey : function(){
        if( !this.get('provider') || !this.get('id') ){
            throw "Can't get key of a non logged user";
        }

        var key = this.get('provider') + '_' + this.get('id');
        return key;
    },
    
    getShortName : function(){
        var name;

        if( $w.util.isEmpty(this.get('first_name')) ){
            return '';
        }

        name = this.get('first_name');
        name += ' ';
        name += this.get('last_name') ? this.get('last_name').substring(0,1) + '.' : '';
        return name;
    }
    
});
$w.models.charts.Chart = $w.models.Abstract.extend({

    defaults : {
        title : 'untitled'
    },

    validations :{
        title : {
            required : [true]
        }
    }

});
$w.models.charts.RemoteChart = Backbone.Firebase.Model.extend($w.models.charts.Chart);
$w.models.charts.RemoteChart = $w.models.charts.RemoteChart.extend({

    firebase : function(){
        var user_id = $w.Application.user().get('id');
        var url = $w.Config.server() + 'charts/';
        url += '/' + this.get('id');
        return new Firebase(url);
    }

});
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
$w.collections.charts.Chart = Backbone.Firebase.Collection.extend({

    model: $w.models.charts.Chart,

    firebase : function(){
        return new Firebase($w.Config.server() + 'charts/');
    }

});
$w.collections.charts.UserChart = Backbone.Firebase.Collection.extend({

    model: $w.models.charts.Chart,

    firebase : function(){
        var user_id = $w.Application.user().get('id');
        return new Firebase($w.Config.server() + 'users-charts/' + user_id);
    }

});
$w.views.Initializing = $w.views.Abstract.extend({

    template : 'start_initializing'

});
$w.views.Login = $w.controls.UIForm.extend({

    template : 'login_login',

    events : function(events){
        var this_events = {
            'click .twitter' : 'loginWithTwitter',
            'click .google' : 'loginWithGoogle',
            'click .facebook' : 'loginWithFacebook',
            'click .github' : 'loginWithGithub'
        };
        return this._super(_.extend(this_events, events));
    },
    
    afterInitialize : function(){
        this._super();
        this.$el.hide();
        //$w.events.on($w.events.USER_LOGGING_ERROR, error);
    },


    afterRender : function(){
        this._super();
        this.$el.show();
    },

    loginWithTwitter : function(){
        $w.Application.auth().login('twitter');
    },

    loginWithGoogle : function(){
        $w.Application.auth().login('google');
    },

    loginWithFacebook : function(){
        $w.Application.auth().login('facebook');
    },

    loginWithGithub : function(){
        $w.Application.auth().login('github');
    },

    errorHandler : function(response){
        this.$('.form_errors').html('The email or password you entered is incorrect.');
    }

});
$w.views.Logout = $w.views.Abstract.extend({

    events : {
    },

    template : 'login_logout',
    
    afterRender : function(){
        this.auth = $w.Application.auth();
        this.auth.logout();
    }
    
});
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
$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterRender : function(){
        this._super();
    }
 
});
$w.views.charts.Editor = $w.controls.UIForm.extend({

    template : 'charts_editor',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change:user_id', this.render);
        this.model.on('change:ready', this.render);
    },

    afterRender : function(){
        this._super();
        if( !this.model.get('user_id') ){
            this.$el.hide();
            return false;
        }
        this.$el.fadeIn();
        if( this.model.get('ready') ){
            //TODO: redirect to chart page
        }
        this.controls.name.$control.focus();
    }

});
$w.views.Footer = $w.views.Abstract.extend({

    events : {
    },

    template : 'commons_footer'
    
});
$w.views.Header = $w.views.Abstract.extend({

    events : {
    },
    
    template : 'commons_header',
    
    getViewData : function(){
        var name = '';
        if( $w.Application.user() ){
            name = $w.Application.user().get('displayName');
        }
        
        var data = {
            name : name
        };
        return data;
    }
    
});
$w.views.ProjectIndex = $w.views.Abstract.extend({

    template : 'project_index'
 
});
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
        this.controlsemail.$control.focus();
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
            this.controls.password.$control.focus();
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
        this.controls.hash.$control.focus();
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
$w.Application = (function (Backbone, _, $) {
    
    var public_scope = {
        initialize : initialize,
        validateLogin : validateLogin,
        display : display,
        guestDisplay : guestDisplay,
        login : login,
        user : user,
        auth : auth,
        fireBase : fireBase,
        loginRequested : loginRequested
    };
    
    var _initialized = false;
    var _lastProtectedRoute = null;
    var _mainView;
    var _user;
    var _fireBase;
    var _auth;
    var _loginRequested = false;

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
        if( validateLogin() ){
            _mainView.display(view);
        }
    }

    function validateLogin(){
        if( !user() ){
            _lastProtectedRoute = Backbone.history.fragment;
            invalidateLogin();
            return false;
        }
        return true;
    }

    function displayProtected(){
        if( _lastProtectedRoute ){
            $w.global.router.go(_lastProtectedRoute);
            _lastProtectedRoute = null;
        }else{
            $w.global.router.go('start');
        }
    }
    
    function login(view){
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
        $w.Application.fireBase().child('users').child(_user.getKey()).set(loggedUser);
        displayProtected();
    }

    function onUserLogOut(){
        _user = null;
        $w.global.router.go('login');
    }
    
    function setUpRouter(){
        $w.global.router = new $w.Router();
        $w.global.router.initialize();
        Backbone.history.start();
    }
    
    function invalidateMainView(){
        _mainView = new $w.views.Main({
            model : new $w.models.Main(),
            el : $('.view-holder')
        });
        _mainView.render();
    }
    
    function invalidateFireBase(){
        if( _fireBase ){
            return null;
        }

        _fireBase = new Firebase($w.Config.server());

    }
    function invalidateLogin(){
        if( _auth ){
            return null;
        }

        invalidateFireBase();
        _loginRequested = true;
        $w.global.router.go('initializing');
        _auth = new FirebaseSimpleLogin(_fireBase, loginLoadedHandler);
    }

    function loginLoadedHandler(error, user) {
        if (user) {
            if( !_user ){
                onUserLogged(user);
            }
            return null;
        }

        if(error){
            $w.events.trigger($w.events.USER_LOGGING_ERROR, error);
        }else{
            if( _user ){
                onUserLogOut();
            }else{
                if( Backbone.history.fragment == 'initializing' ){
                    $w.global.router.go('login');
                }
            }
        }

    }

    function user(){
        return _user;
    }

    function auth(){
        invalidateLogin();
        return _auth;
    }

    function fireBase(){
        invalidateFireBase();
        return _fireBase;
    }

    function loginRequested(){
        return _loginRequested;
    }

    return public_scope;
    
}(window.Backbone, window._, window.$));