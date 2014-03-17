$w.views.charts.Editor = $w.controls.UIForm.extend({

    template : 'charts_editor',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change:user_id', this.render);
        this.model.on('change:ready', this.render);
        this.model.on('change:name', this.nameChangeHandler);
    },

    afterRender : function(){
        this._super();
        if( !this.model.get('user_id') ){
            this.$el.hide();
            return false;
        }
        this.$el.fadeIn();
        this.nameChangeHandler();
        if( !this.model.get('ready') ){

        }
    },

    nameChangeHandler : function(){
        if( this.model.get('name') != this.controls.name.$control.val() ){
            this.controls.name.$control.val(this.model.get('name'));
        }
    }

});