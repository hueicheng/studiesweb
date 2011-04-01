var wikiPath = "";
window.onload = initPage;

function initPage(){
	var r=new RegExp("\\#([\\w/:\\.]+)", "gi");
	if (location.href.match(r)) {
   	   wikiPath = RegExp.$1;
   	   alert(wikiPath);
	}
	
	getText();
}

function getText(){
	
	var url = "page/" + wikiPath.replace(/:/gi, '_')+".txt";
	alert(url);
	$('textPane').load(url, convert);
}
