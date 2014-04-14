$w.views.charts.CreateForm = $w.controls.UIForm.extend({

    template : 'charts_create-form',

    events : function(events){
        var this_events = {
        };
        return this._super(_.extend(this_events, events));
    },

    afterInitialize : function(){
        this.model.on('change:user_id', this.render);
        this.model.on('change:ready', this.render);
    },

    afterRender : function(){
        this._super();
        if( !this.model.get('user_id') ){
            this.$el.hide();
            return false;
        }
        this.$el.fadeIn();
        if( this.model.get('ready') ){
            $w.global.router.go('editor/' + this.model.get('id'));
        }
        this.controls.name.$control.focus();
    }

});