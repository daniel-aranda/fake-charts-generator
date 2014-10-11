$w.views.charts.Donut = $w.views.charts.Abstract.extend({

    template : 'charts_donut',
    active: true,
    salesData: null,
    chartNode: null,

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

        this.looper();

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