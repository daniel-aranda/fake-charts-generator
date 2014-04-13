<?php
require __DIR__ . '/workflow.php';

$public_root = dirname(__DIR__) . '\\public';
$deploy_dir = dirname(dirname(dirname(__DIR__))) . '/deploys/fake-charts-generator';
$version = version();

if( !is_dir($deploy_dir) ){
    abort('deploy dir is not yet created: ' . PHP_EOL . $deploy_dir);
}

write_line('initializing');

chdir($deploy_dir);

exec("git checkout -f gh-pages");
exec("git clean -df");
exec("git status",$output);

write_line(exec("xcopy \"$public_root\" \"$deploy_dir\" /c /q /e /y"));

exec("git add . && git add -u");
exec("git status",$output);
echo implode(PHP_EOL, $output);

exec('git commit -m "deploying version '.$version.'"');
exec('git push');

write_line('deploy finished');