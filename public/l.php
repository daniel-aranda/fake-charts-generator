<?php

require '../api/bootstrap.php';

REST_Route::$uri_base = 'l/';
$route = new REST_Route();
$route->invalidate_route();

?>
<html>
    <head>
    </head>
    <body>
        <p>redirecting...</p>
        <script>
            var request_url = '<?= $route->request_url ?>';
            window.location.replace("/#" + request_url); 
        </script>
    </body>
</html>