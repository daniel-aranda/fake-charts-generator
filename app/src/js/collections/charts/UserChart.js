$w.collections.charts.UserChart = Backbone.Firebase.Collection.extend({

    model: $w.models.charts.Chart,

    firebase : function(){
        var user_id = $w.Application.user().get('id');
        return new Firebase($w.Config.server() + 'users-charts/' + user_id);
    }

});