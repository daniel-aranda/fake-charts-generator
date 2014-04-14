$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start',

    events : function(events){
        var this_events = {
            'click #add-new-chart' : 'addNewChart',
            'click #new-chart-link' : 'addNewChart'
        };
        return this._super(_.extend(this_events, events));
    },

    afterRender : function(){
        this._super();
    },

    addNewChart : function(){
        $w.global.router.newChart();
    }
 
});