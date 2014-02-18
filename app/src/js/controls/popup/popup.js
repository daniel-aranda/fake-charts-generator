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