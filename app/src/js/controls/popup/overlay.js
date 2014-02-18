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