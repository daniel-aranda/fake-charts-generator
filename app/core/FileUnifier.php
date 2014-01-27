<?php
/**
 * 
 * @author: Daniel Aranda <hello@danielarandaochoa.com>
 * 
 * @since: 1.0
 * 
 */
abstract class FileUnifier {
    
    public $source_path = '';
    
    protected $script_buffer;
    protected $comment_begin = '/*';
    protected $comment_end = '*/';
    protected $extensions = array();


    private $imported_files;
    private $output_buffer = '';
    
    public static function get_version(){
        $version = exec("git describe --abbrev=0 --tags");
        return $version;
    }
    
    public function __construct($source_path){
        $this->source_path = $source_path;
        $this->reset();
    }
    
    public function reset(){
        $this->script_buffer = '';
        $this->imported_files = array();
        $this->output_buffer = '';
    }
    
    public function import($source_path){
        $this->import_folder($source_path);
    }
    
    public function compile($public_path, $file_name){
        if( !is_writable($public_path) ){
            throw new Exception('You do not have write permissions on: ' . $public_path);
        }
        
        file_put_contents($public_path . $file_name, $this->script_buffer);
    }
    
    private function validate_source_path($path){
        if( strpos($path, $this->source_path) !== 0 ){
            $path = $this->source_path . $path;
        }
        return $path;
    }
    
    private function import_folder($path){
        
        $path = $this->validate_source_path($path);
        
        $handle = opendir($path);
        if( !$handle ) {
            throw new Exception('Error reading directory: ' . $path);
        }
        
        while (false !== ($entry = readdir($handle))) {
            
            if( in_array($entry, array('.', '..')) ){
                continue;
            }
            
            $path = trim($path, '/');
            $resource = $path.'/'.$entry; 
            
            if( is_dir($resource) ){
                $this->import_folder($resource);
                continue;
            }
            
            $ext = pathinfo($resource, PATHINFO_EXTENSION);
            $ext = strtolower($ext);
            
            if( !in_array($ext, $this->extensions) ){
                continue;
            }
            
            $this->import_file($resource);
            
        }
    
        closedir($handle);
    }
    
    public function import_file($resource){
        
        $file_name = basename( dirname($resource) ) . '/' . basename($resource);
        
        $resource = $this->validate_source_path($resource);
        
        if( in_array($resource, $this->imported_files) ){
            return null;
        }
        
        $this->output_buffer .= 'Loading: ' . $file_name .' '. PHP_EOL;
        $this->add_file_name($resource);
        
        $this->prepend_file_content($resource);        
        $this->script_buffer .= file_get_contents($resource);
        $this->append_file_content($resource);
        $this->script_buffer .= PHP_EOL . PHP_EOL;
        
        $this->imported_files[] = $resource;
    }
    
    protected function add_file_name($resource){
        $this->script_buffer .= $this->comment_begin;
        $this->script_buffer .= 'File: ' . $resource;
        $this->script_buffer .= $this->comment_end . PHP_EOL;
    } 
    
    protected function prepend_file_content($resource){
        //overwrite if needed, write to self::$script_buffer 
    }
    
    protected function append_file_content($resource){
        //overwrite if needed, write to self::$script_buffer 
    }
    
    public function clean_folder($path){
        
        $handle = opendir($path);
        if( !$handle ) {
            throw new Exception('Error reading directory. ' . $path);
        }
        
        while (false !== ($entry = readdir($handle))) {
            
            if( in_array($entry, array('.', '..')) || is_dir($entry) ){
                continue;
            }
            
            $path = trim($path, '/');
            $resource = $path.'/'.$entry; 
            
            $ext = pathinfo($resource, PATHINFO_EXTENSION);
            
            unlink($resource);
            
        }
    
        closedir($handle);
        
    }
    
    public function output(){
        return $this->output_buffer;
    }

}