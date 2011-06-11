<?php
$dir = "imageF/";
$title = $_POST['title'];
$content = rawurldecode($_POST['content']);
$m = $dir . $title;
$fp = fopen($m, "wb");
fwrite($fp, $content);
fclose($fp);

echo $title;
?>
