$w.views.charts.MultiBar = $w.views.charts.Abstract.extend({

    active: true,
    chartNode: null,

    afterRender : function(){
        this._super();

        this.chart = new Rickshaw.Graph({
            element: this.$el[0],
            renderer: Rickshaw.Graph.Renderer.MultiBarLabeled,
            unstack: true,
            height: 400,
            series: [{
                name: 'daniel',
                data: this.randomData(),
                color: 'steelblue'
            }, {
                name: 'was here',
                data: this.randomData(),
                color: 'lightblue'
            }],
            padding: {top: 0.4}
        });

        this.chart.groups = [
            'ROI',
            'REV'
        ];

        this.chart.render();
        this.looper();
    },

    changeData : function(){
        this.chart.series[0].data = this.randomData();
        this.chart.series[1].data = this.randomData();
        this.chart.update();
    },

    randomData: function(){
        return [{ x: 0, y: Math.round(Math.random() * 20)}, { x: 1, y: Math.round(Math.random() * 20) }];
    }

});