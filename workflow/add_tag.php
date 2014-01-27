<?php
require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/workflow.php';

$version = exec("git describe --abbrev=0 --tags");

$prefix = 'version-';
$version = str_replace($prefix, '', $version);

echo 'Current version:  '. $version . PHP_EOL;

$new_version = prompt('New version:     ');
$description = prompt('Description:');

echo exec("git tag -a {$prefix}{$new_version} -m \"{$description}\"");
echo exec("git push origin --tags");