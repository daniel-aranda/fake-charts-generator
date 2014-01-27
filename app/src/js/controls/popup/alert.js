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