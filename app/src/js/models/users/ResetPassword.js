$w.models.users.ResetPassword = $w.models.Abstract.extend({
    
    serviceUrl : 'login/update_password/',
    
    defaults : {
        password : '',
        confirm_password : ''
    },
    
    validations :{
        password : {
            required : [true],
            confirm : ['confirm_password']
        }
    }
    
});