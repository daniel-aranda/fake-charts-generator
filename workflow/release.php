<?php
require __DIR__ . '/../app/bootstrap.php';

$index_source_path = __DIR__ . '/../app/src/index.template';
$js_source_path = __DIR__ . '/../app/src/js/';
$html_source_path = __DIR__ . '/../app/src/html/';
$css_source_path = __DIR__ . '/../app/src/css/';

$public_root = dirname(__DIR__) . '/public/';
$public_path = dirname(__DIR__) . '/assets/fcg/';

$version = JavaScript::get_version();

echo 'Starting Javascript ' . PHP_EOL;
$javascript = new JavaScript($js_source_path);

$javascript->import_file('core/main.js');
$javascript->import('core/');

$javascript->import_file('models/Abstract.js');
$javascript->import_file('views/Abstract.js');
$javascript->import_file('controls/form/ComponentAbstract.js');

$javascript->import('controls/');
$javascript->import('app/');
$javascript->import('models/');
$javascript->import('collections/');
$javascript->import('views/');

$javascript->import_file('app.js');

$javascript->clean_folder($public_path);

$javascript->compile($public_path, 'fcg_'. $version .'.js');

echo $javascript->output() . PHP_EOL;

echo 'Starting HTML Templates' . PHP_EOL;
$html = new Templates($html_source_path);

$html->import('.');

$html->compile($public_root . 'templates/', 'fcg_'. $version .'.html');

echo $html->output();


echo 'Starting CSS ' . PHP_EOL;
$css = new CSS($css_source_path);

$css->import($css_source_path);

$css->compile($public_path, 'fcg_'. $version .'.css');

echo $css->output();

echo 'Starting index.html' . PHP_EOL;

$assets_url = 'http://assets.sandbox.fake-charts-generator.com/';

$vars = array(
    'ASSETS_URL' => $assets_url,
    'JAVASCRIPT' => 'fcg_'. $version .'.js',
    'TEMPLATES' => 'fcg_'. $version .'.html',
    'CSS' => 'fcg_'. $version .'.css'
);

$html = new HTML($index_source_path);
$html->vars = $vars;

$html->compile($public_root, 'index.html');

echo 'End';
