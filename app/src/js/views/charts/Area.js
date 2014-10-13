$w.views.charts.Area = $w.views.charts.Abstract.extend({

    active: true,
    chartNode: null,
    template: 'charts_area',
    className: 'chart-component area',
    looperInterval: 7000,

    afterRender : function(){
        this._super();

        this.chart = new Rickshaw.Graph( {
            element: this.$('.chart')[0],
            width: 600,
            height: 400,
            renderer: Rickshaw.Graph.Renderer.AnimatedArea,
            stroke: true,
            series: [{
                data: this.randomData(),
                color: '#cae2f7'
            }],
            padding: {top: 0.2}
        } );
        this.addXAxis();
        this.addYAxis();
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
            { x: 1, y: Math.round(Math.random() * 50)},
            { x: 2, y: Math.round(Math.random() * 50), star: true},
            { x: 3, y: Math.round(Math.random() * 50) },
            { x: 4, y: Math.round(Math.random() * 50) },
            { x: 5, y: Math.round(Math.random() * 50), star: true},
            { x: 6, y: Math.round(Math.random() * 50) },
            { x: 7, y: Math.round(Math.random() * 50), star: true},
            { x: 8, y: Math.round(Math.random() * 50) }
        ];
    },

    addXAxis : function(){
        this.xAxis = new Rickshaw.Graph.Axis.X({
            graph : this.chart,
            orientation: 'bottom',
            element: this.$('.x-axis')[0],
            tickValues : [0, 2, 4, 6, 8]
        });

        this.xAxis.render();
    },

    addYAxis : function(){
        this.yAxis = new Rickshaw.Graph.Axis.Y({
            graph : this.chart,
            tickFormat : d3.format("$"),
            orientation: 'left',
            element: this.$('.y-axis')[0]
        });

        this.yAxis.render();

    }

});