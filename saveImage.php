<?php
$dir = "imageF/";
$title = $_POST['title'];
$content = rawurldecode($_POST['content']);
header(
	"Accept-Ranges:bytes\n\n" .
	'Connection:keep-alive' . "\n\n" .
	'Content-Disposition:attachment; filename=' + $title + "\n\n" .
	"Content-Type:image/png\n\n"
);

?>
