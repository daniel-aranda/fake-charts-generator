$w.collections.charts.Chart = Backbone.Firebase.Collection.extend({

    model: $w.models.charts.Chart,

    firebase : function(){
        return new Firebase($w.Config.server() + 'charts/');
    }

});