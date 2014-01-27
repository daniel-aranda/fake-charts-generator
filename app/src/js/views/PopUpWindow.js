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