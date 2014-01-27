<?php

function prompt($msg){
    echo $msg . ' ';
    $handle = fopen ("php://stdin","r");
    $line = fgets($handle);
    return trim($line);
    
}