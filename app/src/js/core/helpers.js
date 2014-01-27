
$w.postJSON = function(settings){
    var settings = _.extend({
        type: "POST",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.getJSON = function(settings){
    var settings = _.extend({
        type: "GET",
        contentType : 'application/json',
        dataType: "json"
    }, settings);
    $.ajax(settings);
};


$w.asset = function(path){
    return $w.global.assetsUrl + path;  
};

$w.image = function(path, className){
    return '<img src="' + $w.asset('img/' + path) + '" class="' + className + '" />';  
};

$w.button = function(label, className, type){
    type = type || 'button';
    className = className || '';
    className += ' component-button';
    return '<button type="' + type + '" class="' + className + '">' + label + '</button>';  
};
$w.submitButton = function(label, className, type){
    return $w.button(label, className, 'submit');  
};
$w.cancelButton = function(label, className){
    label = label || 'cancel';
    className = className || '';
    className += ' cancel-button';
    return $w.button(label, className);  
};
