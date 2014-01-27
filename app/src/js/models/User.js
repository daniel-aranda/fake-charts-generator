$w.models.User = $w.models.Abstract.extend({
    
    serviceUrl : 'users',
    
    defaults : {
        email : '',  
        password : '',  
        first_name : '',  
        last_name : ''  
    },
    
    validations :{
        email : {
            required : [true]
        },  
        password : {
            required : [false]
        }  
    },
    
    getShortName : function(){
        var name;
        name = this.get('first_name');
        name += ' ';
        name += this.get('last_name') ? this.get('last_name').substring(0,1) + '.' : '';
        return name;
    }
    
});