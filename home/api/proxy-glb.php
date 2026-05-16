<?php
/**
 * Same-origin proxy for GLB/GLTF files on the Laravel storage host.
 * Avoids browser CORS when model-viewer loads models from free-base-laravel.test.
 */

declare(strict_types=1);

$allowedHost = 'free-base-laravel.test';
$allowedPathPrefix = '/storage/';

$url = isset($_GET['url']) ? trim((string) $_GET['url']) : '';
if ($url === '') {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Missing url parameter';
    exit;
}

$parts = parse_url($url);
if (
    $parts === false
    || empty($parts['scheme'])
    || !in_array(strtolower($parts['scheme']), ['http', 'https'], true)
    || empty($parts['host'])
    || strcasecmp($parts['host'], $allowedHost) !== 0
    || empty($parts['path'])
    || strpos($parts['path'], $allowedPathPrefix) !== 0
) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'URL not allowed';
    exit;
}

$ext = strtolower(pathinfo($parts['path'], PATHINFO_EXTENSION));
$types = [
    'glb'  => 'model/gltf-binary',
    'gltf' => 'model/gltf+json',
    'bin'  => 'application/octet-stream',
];
$contentType = $types[$ext] ?? 'application/octet-stream';

$context = stream_context_create([
    'http' => [
        'method'  => 'GET',
        'timeout' => 60,
        'header'  => "Accept: */*\r\n",
    ],
    'ssl' => [
        'verify_peer'      => false,
        'verify_peer_name' => false,
    ],
]);

$stream = @fopen($url, 'r', false, $context);
if ($stream === false) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Failed to fetch model';
    exit;
}

header('Content-Type: ' . $contentType);
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=3600');

fpassthru($stream);
fclose($stream);
