$w.models.charts.RemoteChart = $w.models.charts.Chart.extend(Backbone.Firebase.Model.prototype);
$w.models.charts.RemoteChart = $w.models.charts.RemoteChart.extend({

    firebase : function(){
        var user_id = $w.Application.user().get('id');
        var url = $w.Config.server() + 'charts/';
        url += '/' + this.get('id');
        return new Firebase(url);
    }

});