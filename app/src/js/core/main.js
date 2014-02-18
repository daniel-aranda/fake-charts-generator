window.FakeChartsGenerator = typeof FakeChartsGenerator != 'undefined' ? FakeChartsGenerator : {};

window.$w = FakeChartsGenerator;

var packages = {
    users : {},
    charts : {}
};

$w.models = JSON.parse(JSON.stringify(packages));
$w.views = JSON.parse(JSON.stringify(packages));
$w.collections = JSON.parse(JSON.stringify(packages));

$w.controls = {};

$w.core = {

    setup : function(scripts, callback){
        this.ajaxSetup();
        this.errorHandlerSetup();
        $('body').on('keyup', this.onKeyUpHandler);
    },
    
    /**
     * Setup ajaxError. Helpful to instantiate it only one time and also have a 
     * custom event to handle the error, if needed.
     * 
     */
    ajaxSetup : function(){
        
        if( this.ajaxInstalled ){
            return false;
        }
        
        this.ajaxInstalled = true;
        
        $( document ).ajaxError(function(event, jqxhr, settings, exception) {
            if(exception == 'Unauthorized'){
                //TODO: enable login throw AJAX
                document.location.reload(true);
            }else{
                $w.events.trigger($w.events.AJAX_ERROR, event, jqxhr, settings, exception);
            }
        });
        
        $( document ).ajaxSend(function(event, jqxhr, settings) {
            $w.events.trigger($w.events.AJAX_BEFORE_SEND, event, jqxhr, settings);
        });
        $( document ).ajaxComplete(function(event, jqxhr, settings) {
            $w.events.trigger($w.events.AJAX_SEND_COMPLETED, event, jqxhr, settings);
        });
    },
    
    errorHandlerSetup : function(){
        window.onerror = function(message, url, linenumber){
            if( message == 'Script error.' ){
                console.log(message, url, linenumber);
            }
        };
    },
    
    onKeyUpHandler : function(e){
        $w.events.trigger($w.events.KEY_UP, e);
    }
};

