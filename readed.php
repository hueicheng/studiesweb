<?php
/*
switch($_GET['type']){
	case 'text':
		$dir = "source/";
		break;
	case 'image':
		$dir = "imageF/";
		break;
	default:
		echo "error";
}*/
$dir = "source/";
$title = $_GET['title'];
$m = $dir . $title;
$fp = fopen($m, "rb");
while (!feof($fp)) {
   $content .= fgets($fp);
}
fclose($fp);

echo rawurldecode($content);

?>
