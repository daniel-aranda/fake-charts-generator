$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterRender : function(){
        this._super();
    }
 
});