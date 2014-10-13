$w.models.charts.Chart = $w.models.Abstract.extend({

    defaults : {
        name : ''
    },

    validations :{
        title : {
            required : [true]
        }
    }

});