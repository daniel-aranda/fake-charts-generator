$w.models.Abstract = Backbone.Model.extend({

    validations : null,

    initialize : function(){
        $w.util.bindAll(this);
    },
    
    urlRoot : function(){
        return $w.global.apiUrl + this.serviceUrl;  
    },
    
    validateInput: function(attrs, options) {
        var valid = true;
        _.each(this.validations, function(validations, key){
            valid = this.validateField(validations, key);
        }, this);
        
        return valid;
    },

    validateField : function(validations, key){
        var valid = true;
        var msg;
        if(validations.required && validations.required[0]){
            if( $w.util.isEmpty(this.get(key)) ){
                valid = false;
                msg = validations.required[1] ? validations.required[1] : key + ' is required';
                this.trigger($w.events.FORM_INVALID + ':' + key, msg);
            }
        }
        if(validations.confirm && validations.confirm[0]){
            if( this.get(key) && this.get(key) != this.get(validations.confirm[0]) ){
                valid = false;
                msg = validations.confirm[1] ? validations.confirm[1] : validations.confirm[0] + " isn't the same than " + key;
                this.trigger($w.events.FORM_INVALID + ':' + validations.confirm[0], msg);
            }
        }
        return valid;
    }
        
});