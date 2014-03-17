$w.views.charts.Editor = $w.views.Abstract.extend({

    template : 'charts_editor',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change', this.render);
    },

    afterRender : function(){
        this._super();
        if( !this.model.get('user_id') ){
            this.$el.hide();
            return false;
        }
        this.$el.fadeIn();
        if( !this.model.get('ready') ){
            
        }
    }

});