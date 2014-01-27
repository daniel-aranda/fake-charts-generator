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