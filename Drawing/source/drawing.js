var firstPointX = 0;
var firstPointY = 0;
var isMouseDown = false;
var canvas, cxt;

window.onload = function(){

	leftBtn = document.getElementById("toolbar").getElementsByTagName("a");
	
	for(i=0; i<leftBtn.length; i++){
		var currentBtn = leftBtn[i];
		currentBtn.onclick = usingBtn;
	}
	
	
	canvas = document.getElementById('workarea');
	cxt = canvas.getContext("2d");
	canvas.onmousedown = function(e){
		isMouseDown = true;
		firstPointX = e.offsetX;
		firstPointY = e.offsetY;	
	};
	canvas.onmouseup = function(e){
		isMouseDown = false;

		//drawLine(e.offsetX, e.offsetY);
		//drawRect(e.offsetX, e.offsetY);
		//drawCircle(e.offsetX, e.offsetY);
	};
	
	canvas.onmousemove = function(e){
		if(isMouseDown){
			drawLine(e.offsetX, e.offsetY);
			firstPointX = e.offsetX;
			firstPointY = e.offsetY;
		}
		
	};
	
	canvas.width = 800;
	canvas.height = 600;
};

function lineReview(e){
	if(isMouseDown){
	secondPointX = e.offsetX;
    secondPointY = e.offsetY;
    var canvas = document.getElementById('myLine');
    if(canvas && canvas.getContext){
      var cxt = canvas.getContext("2d");
  	  cxt.strokeStyle = "#f00";
	  cxt.lineWidth = 3;
	  cxt.moveTo(firstPointX,firstPointY);
	  cxt.lineTo(secondPointX,secondPointY);
	  cxt.stroke();
    }
  }
}

function drawLine(x, y){
	//var canvas = document.getElementById('workarea');
	
		
		cxt.strokeStyle = "#f00";
		cxt.lineWidth = 3;
		cxt.moveTo(firstPointX,firstPointY);
		cxt.lineTo(x,y);
		cxt.stroke();
	
  
}

function drawRect(x, y){
	var cxt = canvas.getContext("2d");
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	cxt.rect(firstPointX, firstPointY, x, y);
	cxt.stroke();
}

function drawCircle(x, y){
	var cxt = canvas.getContext("2d");
	cxt.storkeStyle = "#f00";
	cxt.lineWidth = 3;
	cxt.beginPath();
	cxt.arc(firstPointX, firstPointY, x, y, Math.PI * 2, true);
	cxt.closePath();
}

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
function fill(){}
function rect(){}
function round(){}
