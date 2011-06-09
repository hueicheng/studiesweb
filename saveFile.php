<?php
$dir = "source/";
$title = $_POST['title'];
$content = $_POST['content'];
$m = $dir . $title;
$fp = fopen($m, 'w');
fwrite($fp, $content);
fclose($fp);

?>
