<?php
/**
 * 
 * @author: Daniel Aranda <hello@danielarandaochoa.com>
 * 
 * @since: 1.0
 * 
 */
final class Templates extends FileUnifier {
    
    protected $extensions = array('html');
    
    protected $comment_begin = '<!--';
    protected $comment_end = '-->';
    
    protected function prepend_file_content($resource){
        $template_path = pathinfo($resource);
        $template_name = basename($template_path['dirname']) . '_' . $template_path['filename'];
        $this->script_buffer .= '<script type="text/x-DanielAranda-tpl" class="tpl '.$template_name.'">'; 
    }
    
    protected function append_file_content($resource){
        $this->script_buffer .= '</script>'; 
    }
    
}