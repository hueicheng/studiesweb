  var x;
  var y;
  var link;
  
  function pasteNote(){
	x = event.clientX;
	y = event.clientY;
	if(link != null){
		var addImg = document.createElement("img");
		addImg.className = "note";
		addImg.src = link;
		alert(link);
		addImg.width = 15;
		addImg.height = 30;
		addImg.style.left = parseInt(x,10);
		addImg.style.top = parseInt(y,10) -25;
		addImg.style.position = "absolute";
		document.body.appendChild(addImg);
		alert(x);
		alert(y);	
    }
  }
  
  function choiceNote(){
	link = event.toElement.src;
	alert(link);
  }
  
  