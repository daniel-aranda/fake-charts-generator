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
        var u = $w.Application.user().get('id');
        var newChart = c.add({user_id :u, bonita:'Lily' })[0];
    },

    afterRender : function(){
        this._super();
        //$w.Application.fireBase().child('charts').child('chart').set({user_id : uid, name : 'daniel'});

//        var b = $w.Application.fireBase();
//        b.child('charts').push({user_id : uid, name : 'daniel'});
//
//        b.child('charts').endAt().limit(10).on('child_added', function(snapshot) {
//            console.log(snapshot.val().name)
//        })

//        Firebase.goOnline()

    }
 
});