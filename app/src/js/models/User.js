$w.models.User = $w.models.Abstract.extend({
    
    serviceUrl : 'users',
    
    defaults : {
        email : '',  
        password : '',  
        first_name : '',  
        last_name : '',
        profile_picture_url : null,
        provider : null
    },
    
    validations :{
        email : {
            required : [true]
        },  
        password : {
            required : [false]
        }  
    },

    getProfilePicture : function(){
        if( !this.get('provider') ){
            return null;
        }

        var url = '';

        switch(this.get('provider')){
            case 'facebook':
                url = 'http://graph.facebook.com/' + this.get('username') +'/picture';
                break;
            case 'google':
                url = this.get('thirdPartyUserData').picture;
                break;
            case 'twitter':
                url = this.get('profile_image_url');
                break;
            case 'github':
                url = this.get('avatar_url');
                break;
            default:
                throw 'Unknown provider for the user: ' + this.get('provider');
        }
        return url;
    },

    getKey : function(){
        this.validateUser();
        var key = this.get('provider') + '_' + this.get('id');
        return key;
    },

    validateUser : function(){
        if( !this.get('provider') || !this.get('id') ){
            throw "Can't get key of a non logged user";
        }
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