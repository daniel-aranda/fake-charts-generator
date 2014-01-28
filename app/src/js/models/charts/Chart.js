$w.models.charts.Chart = $w.models.Abstract.extend({

    defaults : {
        title : 'untitled'
    },

    validations :{
        title : {
            required : [true]
        }
    }

});