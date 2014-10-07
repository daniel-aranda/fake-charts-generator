$w.models.charts.Chart = $w.models.Abstract.extend({

    defaults : {
        name : 'untitled'
    },

    validations :{
        title : {
            required : [true]
        }
    }

});