$w.views.charts.MultiBar = $w.views.charts.Abstract.extend({

    active: true,
    chartNode: null,

    afterRender : function(){
        this._super();

        var graph = new Rickshaw.Graph({
            element: this.$el[0],
            renderer: 'bar',
            stack: false,
            series: [{
                data: [ { x: 0, y: 40 }, { x: 1, y: 49 }],
                color: 'steelblue'
            }, {
                data: [ { x: 0, y: 20 }, { x: 1, y: 24 }],
                color: 'lightblue'
            }]
        });

        graph.render();
    },

    changeDate : function(){
    },

    randomData: function(){
    }

});