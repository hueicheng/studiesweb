<?php
$dir = "source/";
$title = $_GET['title'];
$m = $dir . $title;
$fp = fopen($m, "r");
while (!feof($fp)) {
   $content .= fgets($fp);
}
fclose($fp);

echo $content;

?>
