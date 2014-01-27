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