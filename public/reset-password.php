<?php

require '../api/bootstrap.php';

if( !empty($_GET['hash']) ){
    $hash = $_GET['hash'];
    setcookie(REST_Login::$cookie_hash_recovery, $hash, time() + 30 * MINUTES, '/', REST_Config::domain());
}

header('Location: /l/reset-password');