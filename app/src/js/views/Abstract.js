$w.views.Abstract = Backbone.View.extend({
        
        packageName : null,
        template : null,
        _rendered : false,

        initialize : function(){
            $w.util.bindAll(this);
            this.afterInitialize();
        },
        
        events : function(events){
            return events;
        },
        
        getTemplate : function(template, data){
            template = $w.tpl.getTemplate(template, data);
            this.$el.html(template);
        },
        
        render : function(){
            
            if( !this.template ){
                throw 'template is required in order to proper render';
            }

            this.beforeRender();

            this.getTemplate(this.template, this.getViewData());  
            
            this.afterRender();

            this._rendered = true;
        },
        
        getViewData : function(){
            if( this.model ){
                return this.model.toJSON();
            }  
            return null;
        },
        
        afterInitialize : function(){
        },
        
        beforeRender : function(){
        },
        
        afterRender : function(){
        }
          
});