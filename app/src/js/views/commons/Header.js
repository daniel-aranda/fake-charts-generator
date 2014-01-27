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