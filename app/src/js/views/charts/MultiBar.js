$w.views.charts.MultiBar = $w.views.charts.Abstract.extend({

    active: true,
    chartNode: null,

    afterRender : function(){
        this._super();

        var graph = new Rickshaw.Graph({
            element: this.$el[0],
            renderer: Rickshaw.Graph.Renderer.MultiBarLabeled,
            unstack: true,
            height: 400,
            series: [{
                name: 'daniel',
                data: [ { x: 0, y: 40 }, { x: 1, y: 49 }],
                color: 'steelblue'
            }, {
                name: 'rocks',
                data: [ { x: 0, y: 20 }, { x: 1, y: 24 }],
                color: 'lightblue'
            }],
            padding: {top: 0.4}
        });

        graph.groups = [
            'ROI',
            'REV'
        ];

        graph.render();
    },

    changeDate : function(){
    },

    randomData: function(){
    }

});