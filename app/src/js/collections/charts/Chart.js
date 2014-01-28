$w.collections.charts.Chart = Backbone.Firebase.Collection.extend({

    model: $w.models.charts.Chart,

    firebase: new Firebase($w.Config.server() + 'charts/')

});