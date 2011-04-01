window.onload = init;
window.onload = dtC;

function dtC(){
  dtC1 = document.getElementById("files01").getElementsByTagName("dt");
  dtM1 = document.getElementById("files02").getElementsByTagName("dt");
    for(x=0; x<dtC1.length; x++){
	  var dtC2 = dtC1[x];
	  dtC2.onclick = ddF;
	 }
	for(y=0; y<dtM1.length; y++){
	  var dtM2 = dtM1[y];
	  dtM2.onmouseover = ddM;
  }
}

function ddF(){
  ddF1 = document.getElementById("files01").getElementsByTagName("dd");

  for(i=0; i<ddF1.length; i++){
	ddF2 = ddF1[i];
	if(ddF2.style.display == "block"){
		ddF2.style.display = "none";
	}
	else{
		ddF2.style.display = "block";
	}
  }

}

function ddM(){
  ddM1 = document.getElementById("files02").getElementsByTagName("dd");

  for(i=0; i<ddM1.length; i++){
    ddM2 = ddM1[i];
	ddM2.style.display = "block";
  }
}

function test(){
		  ddM1 = document.getElementById("files02").getElementsByTagName("dd");
		  ddF1 = document.getElementById("files01").getElementsByTagName("dd");
		  for(j=0;j<ddM1.length;j++){
		    ddM2 = ddM1[j];
			ddM2.style.display = "block";
		  }
		  for(a=0;a<ddF1.length;a++){
		    ddF2 = ddF1[a];
			ddF2.style.display = "none";
		  }
}

function init(){
	
	leftBtn = document.getElementById("leftModule").getElementsByTagName("a");
	
	for(i=0; i<leftBtn.length; i++){
		var currentBtn = leftBtn[i];
		currentBtn.onclick = usingBtn;
	}
}

function usingBtn(){
	var selected = this.title;
	var btns = document.getElementById("leftModule").getElementsByTagName("a");
	for(i=0; i<btns.length; i++){
		var current = btns[i];
		if(current.title == selected){
			current.className = current.className.concat(" using");
			usedStatus(current);
		}else{
			current.className = current.className.replace(" using", "");
		}
	}
}
function usedStatus(obj){
	switch(obj.title){
		case "select":
		case "pen":
		case "line":
			line(document.event);
			break;
		case "fill":
		case "rect":
		case "round":
	}
}

canvas = document.getElementById("workarea");
tempx = 0 , tempy = 0;
function getCoor(e){
	tempx = e.pageX, tempy = e.pageY;
}

function select(){}
function pen(){}
function line(e){
	var cxt = canvas.getContext("2d");
	cxt.strokeStyle = "#000000";	//線條顏色;
	cxt.lineWidth = 2;				//線條粗細;
	
	canvas.onmousedown = getCoor;
	cxt.moveTo(tempx, tempy);
	
	canvas.onmouseup = getCoor;
	cxt.lineTo(tempx,tempy);
	
	cxt.stroke();
}
function fill(){}
function rect(){}
function round(){}
