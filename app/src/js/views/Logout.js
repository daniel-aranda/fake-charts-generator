$w.views.Logout = $w.views.Abstract.extend({

    events : {
    },

    template : 'login_logout',
    
    afterRender : function(){
        this.auth = $w.Application.auth();
        this.auth.logout();
    }
    
});