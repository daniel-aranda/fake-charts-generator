$w.views.charts.CreateForm = $w.controls.UIForm.extend({

    className : 'content-box create-form',
    template : 'charts_create-form',

    events : function(events){
        var this_events = {
            'click .btn-create' : 'createClickHandler'
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change:user_id', this.render);
        this.model.on('change:chart_type', this.render);
    },

    afterRender : function(){
        this._super();

        if( !this.model.get('user_id') ){
            this.$el.hide();
            return false;
        }

        this.$el.fadeIn();

        this.controls.name.$control.focus();

        this.invalidateChart();

    },

    invalidateChart : function(){
        if( !this.model.get('chart_type') ){
            this.$('.chart-container').html('');
            this.chart = null;
            return null;
        }

        this.removeExistingChart();
        this.buildChart();

        this.$('.chart-container').append(this.chart.el);
        this.chart.render();
    },

    removeExistingChart : function(){
        if( this.chart ){
            this.chart.remove();
            this.$('.chart-container').empty();
        }
    },

    buildChart : function(){

        var chartType = this.model.get('chart_type');
        switch(chartType){
            case 'donut':
                this.chart = new $w.views.charts.Donut({model : this.model});
                break;
            case 'multi-bar':
                this.chart = new $w.views.charts.MultiBar({model : this.model});
                break;
            default:
                throw 'Invalid chart type: ' + chartType;
        }
    },

    createClickHandler : function(){
        this.model.set({ready : true});
    }

});