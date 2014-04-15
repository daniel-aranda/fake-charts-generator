$w.views.Header = $w.views.Abstract.extend({

    events : {
    },
    
    template : 'commons_header',
    
    getViewData : function(){
        var name = '';
        var profileImageUrl = '';
        if( $w.Application.user() ){
            name = $w.Application.user().get('displayName');
            profileImageUrl = $w.Application.user().getProfilePicture();
        }
        
        var data = {
            name : name,
            profileImageUrl : profileImageUrl
        };
        return data;
    }
    
});