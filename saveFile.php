<?php
$dir = "source/";
$title = $_POST['title'];
$content = $_POST['content'];
$m = $dir . $title;
$fp = fopen($m, "wb");
fwrite($fp, $content);
fclose($fp);

?>
