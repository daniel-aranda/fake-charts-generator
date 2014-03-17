$w.models.charts.RemoteChart = Backbone.Firebase.Model.extend($w.models.charts.Chart);
$w.models.charts.RemoteChart = $w.models.charts.RemoteChart.extend({

    firebase : function(){
        var user_id = $w.Application.user().get('id');
        var url = $w.Config.server() + 'charts/';
        url += '/' + this.get('id');
        return new Firebase(url);
    }

});