$w.views.charts.Donut = $w.controls.UIForm.extend({

    template : 'charts_donut',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change:ready', this.render);
    },

    afterRender : function(){
        this._super();
        var salesData=[
            {label:"Basic", color:"#3366CC"},
            {label:"Plus", color:"#DC3912"},
            {label:"Lite", color:"#FF9900"},
            {label:"Elite", color:"#109618"},
            {label:"Delux", color:"#990099"}
        ];

        var chartContainer = this.$('svg')[0];
        var svg = d3.select(chartContainer).attr("width",700).attr("height",300);
        var chartNode = this.$('svg g')[0];

        Donut3D.draw(chartNode, randomData(), 150, 150, 130, 100, 40, 0.4);

        function changeData(){
            Donut3D.transition(chartNode, randomData(), 130, 100, 30, 0.4);
        }

        setInterval(changeData, 3000);

        function randomData(){
            return salesData.map(function(d){
                return {label:d.label, value:1000*Math.random(), color:d.color};});
        }

    }

});