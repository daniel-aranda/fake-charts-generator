$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start',

    events : function(events){
        var this_events = {
            'click #add-new-chart' : 'addNewChart'
        };
        return this._super(_.extend(this_events, events));
    },

    addNewChart : function(){
        var c = new $w.collections.charts.UserChart();
        var newChart = c.add({})[0];

    },

    afterRender : function(){
        this._super();
    }
 
});