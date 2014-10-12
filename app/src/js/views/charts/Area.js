$w.views.charts.Area = $w.views.charts.Abstract.extend({

    active: true,
    chartNode: null,

    afterRender : function(){
        this._super();

        this.chart = new Rickshaw.Graph( {
            element: this.$el[0],
            width: 700,
            height: 400,
            renderer: Rickshaw.Graph.Renderer.AnimatedArea,
            stroke: true,
            series: [ {
                data: this.randomData(),
                color: '#cae2f7'
            } ]
        } );
        this.chart.render();
        this.looper();
    },

    changeData : function(){
        this.chart.series[0].data = this.randomData();
        this.chart.update();
    },

    randomData: function(){
        return [
            { x: 0, y: Math.round(Math.random() * 50)},
            { x: 0, y: Math.round(Math.random() * 50)},
            { x: 0, y: Math.round(Math.random() * 50)},
            { x: 1, y: Math.round(Math.random() * 50) }
        ];
    }

});