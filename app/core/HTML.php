<?php
/**
 * 
 * @author: Daniel Aranda <hello@danielarandaochoa.com>
 * 
 * @since: 1.0
 * 
 */
final class HTML{

    public $source_file = '';
    public $vars = array();

    public function __construct($source_file){
        $this->source_file = $source_file;
    }
    
    public function compile($public_path, $file_name){
        
        $file = file_get_contents($this->source_file);
        
        foreach($this->vars as $key => $value){
            $key = '{'.$key.'}';
            $file = str_replace($key, $value, $file);
        }
        
        file_put_contents($public_path . $file_name, $file);
        
    }    

}