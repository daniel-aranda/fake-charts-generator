<?php

date_default_timezone_set('America/New_York');

#application helpers
function version(){
    $version = exec("git describe --abbrev=0 --tags");
    return $version;
}

function abort($reason){
    echo '====== aborting mission ======' . PHP_EOL;
    echo 'reason: ' . $reason;
    exit;
}

#system helpers

function cmd_path($path){
    $path = str_replace(' ', '\ ', $path);
    return $path;
}

function write_line($line){
    echo '[' . date('H:m s\s') . '] ' . $line . PHP_EOL;
}

function prompt($msg, $multiline = false){
    echo $msg . ' ';
    if( $multiline ){
        echo "('end' to finish)" . PHP_EOL;
    }
    $handle = fopen ("php://stdin","r");
    $content = '';
    do{
        $line = fgets($handle);
        if($multiline && trim($line) == 'end'){
            $multiline = false;
        }else{
            $content .= $line;
        }
    }while($multiline);

    return trim($content);

}