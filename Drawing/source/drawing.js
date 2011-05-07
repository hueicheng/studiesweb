google.load("jqueryui", "1.8");

var firstPointX = 0;
var firstPointY = 0;
var isMouseDown = false;
var canvas, cxt;

$(function(){
	$("#toolbar dl dd").click("usingBtn");
	
	/*
	leftBtn = document.getElementById("toolbar").getElementsByTagName("a");
	
	for(i=0; i<leftBtn.length; i++){
		var currentBtn = leftBtn[i];
		currentBtn.onclick = usingBtn;
	}
	*/
});

function focus(){
  	var notice = document.getElementById("canvasPaper").getElementsByTagName("dt");
	if(notice.length == 1){
	  canvas = document.getElementsByTagName("canvas")[0];
	  draw();
	}

	if(notice.length > 1){
      for(i=0;i < notice.length; i++){
        notice[i].onclick = function(){
	      canvas = document.getElementsByTagName("canvas")[i-1];
		  draw();
	    }
      }
	  	notice[0].onclick = function(){
			canvas = document.getElementsByTagName("canvas")[0];
			draw();
		}
	}
}

function draw(){
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
		  drawCircle(e.offsetX, e.offsetY);
	  };
	  /*	canvas.onmousemove = function(e){
		if(isMouseDown){
			var penWidth = document.getElementById("penWidth");
			temp = parseInt(penWidth.value,10);
			brushes(e.offsetX, e.offsetY,temp);
			firstPointX = e.offsetX;
			firstPointY = e.offsetY;
		}
	    };*/
}
function addCanvas(x,y){
  var addcanvas = document.createElement("canvas");
  addcanvas.className = "workarea"
  addcanvas.width = 500;
  addcanvas.height = 500;
  var dd = document.createElement("dd");
  dd.appendChild(addcanvas);
  var dt = document.createElement("dt");
  var span = document.createElement("span");
  var spanTextNode = document.createTextNode("X");
  span.appendChild(spanTextNode);
  dt.appendChild(span);
  var dl = document.createElement("dl");
  dl.className = "sort";
  dl.appendChild(dt);
  dl.appendChild(dd);
  var div = document.getElementById("canvasPaper");
  div.appendChild(dl);
  focus();
}

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

function brushes(x,y){
		cxt.beginPath();
  		cxt.strokeStyle = "#f00";
		cxt.lineWidth = temp;
		cxt.moveTo(firstPointX,firstPointY);
		cxt.lineTo(x,y);
		cxt.stroke(); 
		cxt.closePath();
}

function drawRect(x,y){
  if(canvas && canvas.getContext){
    var cxt = canvas.getContext("2d");
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	var temp1 = (x - firstPointX);
	var temp2 = (y - firstPointY);
	cxt.rect(firstPointX,firstPointY,temp1,temp2);
	cxt.stroke();
  }
}

function drawCircle(x,y){
  if(canvas && canvas.getContext){
    var cxt = canvas.getContext("2d");
	var a = (x - firstPointX) * (x - firstPointX);
	var b = (y - firstPointY) * (y - firstPointY);
	var radius = (Math.sqrt(a + b) / 2);
	var centerX = ((firstPointX + x)/2);
	var centerY = ((firstPointY + y)/2);
	
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	cxt.fillStyle = "#f00";
	cxt.beginPath();
	cxt.arc(centerX,centerY,radius,0,Math.PI * 2,true);
	//arc(x,y,radius,startAngle,endAngle,anticlockwise);
	cxt.closePath();
	cxt.fill();
	
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

