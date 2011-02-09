window.onload = init;

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
			//document.onmousemove = selected;
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
			document.onmousemove = line;
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
