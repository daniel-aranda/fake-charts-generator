$w.events = {
    AJAX_ERROR : 'AJAXErrorEvent',
    AJAX_BEFORE_SEND : 'AJAXBeforeSendEvent',
    AJAX_SEND_COMPLETED : 'AJAXAfterSendEvent',
    KEY_UP : 'KeyUpEvent',
    USER_LOGGED : 'UserLoggedEvent',
    USER_LOGGING_ERROR : 'UserLoggingErrorEvent',
    USER_LOGOUT : 'UserLogOutEvent',
    FORM_INVALID : 'FormInvalidEvent'
};
   
_.extend($w.events, Backbone.Events);