$w.views.Start = $w.views.Abstract.extend({

    template : 'start_start',

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

//        var c = new $w.collections.charts.Chart();
//        c.add({daniel : 'no pinches mames'});
    }
 
});