
/**
 * 
 * danielarandaochoa.com
 * Template Library
 * ::::::::::::::::::::::::::::
 * 
 * Use this library to load external templates to your module. The logic is to store HTML templates into packages. 
 *      One package per module and also one package for commons. The path to store the templates is:
 *      /assets/templates/{package}.html
 *      Package will contain templates in this way:
 *      <script class="tpl{TemplateName}" type="text/x-FCG-tpl">
 *          This is a containg for a Template
 *      </script>
 * 
 *      To get a Template use:
 *      $s.tpl.getTemplate('campaigns', 'drafts-list', data);
 * 
 *      Real worl example to get the template for the Package "Campaigns" and the template "drafts-list"
 *      $s.tpl.getTemplate('campaigns', 'drafts-list', data);  
 * 
 * @author: Daniel Aranda
 * 
 * @since: 2.0
 * 
 */

$w.tpl = {
    
    templatesPath : '',
    
    templates : {},
    
    compiledTemplates : {},
    
    loadTemplates : function(templateUrl){
        
        $.ajax({
            url: templateUrl,
            context: this,
            async: false,
            success: function(templateRaw) { 
                this.templates = $('<div />').append(templateRaw);
                this.templatesLoaded = true;
            },
            error: function(){
                console.log('Error loading this template: ' + templateFile);
            }
        });
         
    },
    
    getTemplate : function(name, data){
        
        if( !this.templatesLoaded ){
            throw 'Templates should be loaded first';
        }
        
        if( !this.compiledTemplates[name] ){
            var templateDom = this.templates.find( '.tpl.' + name);
            
            if( templateDom.length === 0 ){
                console.log('Template Not Found.', arguments);
                return 'Template Not Found.';
            }
            if( templateDom.length > 1 ){
                console.log(arguments);
                console.log('You defined more than one template with the same name. Please make sure each template has a unique name.');
            }
            try{
                this.compiledTemplates[name] = _.template( templateDom.html() );
            }catch(e){
                console.log('Error preparing the template: ' + e.message);
                console.log('Template: ', arguments);
            }
        }
        
        var template = this.compiledTemplates[name];
        var result;

        try{
            result = template(data);
        }catch(e){
            console.log('Error rendering the template: ' + e.message);
            console.log('Template: ', arguments);
        }
         
        return result;
    }
    
};