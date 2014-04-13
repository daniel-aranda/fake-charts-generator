<?php
require __DIR__ . '/workflow.php';

$public_root = dirname(__DIR__) . '/public/';

$deploy_dir = dirname(dirname(dirname(__DIR__))) . '/deploys/fake-charts-generator';

if( !is_dir($deploy_dir) ){
    abort('deploy dir is not yet created: ' . PHP_EOL . $deploy_dir);
}

write_line('initializing');
write_line(exec("git checkout -f gh-pages", $output));
write_line(exec("git status"));