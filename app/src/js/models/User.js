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

    getKey : function(){
        if( !this.get('provider') || !this.get('id') ){
            throw "Can't get key of a non logged user";
        }

        var key = this.get('provider') + '_' + this.get('id');
        return key;
    },
    
    getShortName : function(){
        var name;

        if( $w.util.isEmpty(this.get('first_name')) ){
            return '';
        }

        name = this.get('first_name');
        name += ' ';
        name += this.get('last_name') ? this.get('last_name').substring(0,1) + '.' : '';
        return name;
    }
    
});