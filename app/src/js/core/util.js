$w.util = {
    
    clone : function(target){
        return JSON.parse(JSON.stringify(target));  
    },
    
    /**
     * $s.util.isSet(value)
     * Some kind of equivalent to PHP isset, we verify the type of the var and return true only if it is different than null or undefined
     * 
     */
    isSet : function(value){
      
      var isValue = true;
      
      switch(typeof value){
          case "undefined":
            isValue = false;
            break;
          case "object":
            isValue = value !== null;
            break;
      }
      
      return isValue;  
    },
    
    /**
     * $s.util.isSet(value)
     * Some kind of equivalent to PHP empty, we verify the content of the var and return true only if it is equal to '', null or undefined
     * 
     */
    isEmpty : function(value){
        if( !this.isSet(value) ){
            return true;
        }
        if( typeof value == "string" ){
            return value.length === 0;
        }
        return false;
    },
    
    nl2br : function(str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    
    bindAll : function(target){
        if( !target || typeof target != 'object'){
            return null;
        }
        
        for(var i in target){
            if( typeof target[i] == 'function' ){
                target[i] = _.bind(target[i], target);
            }
        };
        
    },
    
    pos : function($item, top, left){
        $item.css('top', top + 'px'); 
        $item.css('left', left + 'px'); 
    },
    
    ajaxErrorMessage : function(request){
        var msg = '';
        try{
            var responseJson = $.parseJSON( request.responseText );
            msg = ' ' + responseJson.error_detail.error_message;
        }catch(e){
        }
        return msg;
    }
    
};
