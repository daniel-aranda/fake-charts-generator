$w.views.charts.Editor = $w.views.Abstract.extend({

    template : 'charts_editor',
    chart : null,

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
        if( !this.model.get('ready') ){
            this.$el.hide();
            return false;
        }
        this.$el.fadeIn();
        this.invalidateChart();

        this.$('.chart-container').append(this.chart.el);
        this.chart.render();

    },

    invalidateChart : function(){
        var chartType = this.model.get('chart_type');
        switch(chartType){
            case 'donut':
                this.chart = new $w.views.charts.Donut({model : this.model});
                break;
            default:
                throw 'Invalid chart type: ' + chartType;
        }
    }

});