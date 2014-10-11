$w.views.charts.Abstract = $w.views.Abstract.extend({

    template : 'charts_empty',
    active: true,

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    remove : function(){
        this._super();
        this.active = false;
    },

    looper : function(){
        setTimeout(this.looperStep, 3000);
    },

    looperStep : function(){
        if( this.active ){
            this.changeDate();
            this.looper();
        }
    },

    changeDate : function(){
        throw new Error('You should overwrite this.');
    },

    randomData: function(){
        throw new Error('You should overwrite this.');
    }

});