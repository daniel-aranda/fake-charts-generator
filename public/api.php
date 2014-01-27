<?php

require '../api/bootstrap.php';

REST_Server::start();

$cfg = ActiveRecord\Config::instance();
$cfg->set_model_directory('../api/models/system');
$cfg->set_connections(REST_Config::db());
$cfg->set_default_connection(REST_Config::environment());

$memcache = new Memcache();
REST_Memcache::start($memcache);

$route = new REST_Route();
$route->invalidate_route();
$response = REST_Server::execute( $route );

REST_Response::add_response( $response );
REST_Response::output();