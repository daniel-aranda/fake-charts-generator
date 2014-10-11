$w.views.charts.Donut = $w.controls.UIForm.extend({

    template : 'charts_donut',
    active: true,
    salesData: null,
    chartNode: null,

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
    },

    removeHandler : function(){
        this.active = false;
    },

    afterRender : function(){
        this._super();
        this.salesData=[
            {label:"Basic", color:"#3366CC"},
            {label:"Plus", color:"#DC3912"},
            {label:"Lite", color:"#FF9900"},
            {label:"Elite", color:"#109618"},
            {label:"Delux", color:"#990099"}
        ];

        var chartContainer = this.$('svg')[0];
        var svg = d3.select(chartContainer).attr("width",700).attr("height",500);
        this.chartNode = this.$('svg g')[0];

        Donut3D.draw(this.chartNode, this.randomData(), 300, 230, 230, 200, 50, 0.4);

        setTimeout(this.looper, 3000);

    },

    looper : function(){
        if( this.active ){
            this.changeDate();
            setTimeout(this.looper, 3000);
        }
    },

    changeDate : function(){
        Donut3D.transition(this.chartNode, this.randomData(), 230, 200, 50, 0.4);
    },

    randomData: function(){
        return this.salesData.map(function(d){
                return {label:d.label, value:1000*Math.random(), color:d.color};
        });
    }

});