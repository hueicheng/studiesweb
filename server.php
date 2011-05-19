<?php
error_reporting(E_ALL);

header("Content-Type: text/event-stream\n\n");

$dateTime = new DateTime();
$now = $dateTime->format('c');

echo 'data: ' . $now . "\n";

?>
