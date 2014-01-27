$w.models.users.ValidateHash = $w.models.Abstract.extend({
    
    serviceUrl : 'login/validate_hash/',
    
    defaults : {
        hash : ''
    },
    
    validations :{
        hash : {
            required : [true]
        }
    }
    
});