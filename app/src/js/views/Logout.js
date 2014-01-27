$w.views.Logout = $w.views.Abstract.extend({

    events : {
    },

    template : 'login_logout',
    
    afterRender : function(){
        
        $.getJSON($w.global.apiUrl + 'login/logout', null, this.responseHandler);
    },
    
    responseHandler : function(response){
        if(response.error){
            //this.$('.form_errors').html('The email or password you entered is incorrect.');
        }else{
            this.trigger($w.events.USER_LOGOUT);
        }
    }
    
});