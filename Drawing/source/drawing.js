var firstPointX = 0;
var firstPointY = 0;
var isMouseDown = false;
var isMessage = false;
var selectedStucks;

function addMessageBox(){
	isMessage = true;
	
	$('body').append(
		'<div title="message" class="drag">' +
		'<div class="title">X</div>' +
		'<div class="content">' +
		'width:<input title="width" type="text"/> height:<input title="height" type="text" /><br />' +
		'<button id="check">OK!</button>'+
		'</div>' +
		'</div>'
	);
	
	$('#check').click(function(){
		addCanvas($('input[title="width"]').val(), $('input[title="height"]').val());
	});
	
	t = $(document).height() / 2 - 150;
	l = $(document).width() / 2 - 150;
	$('div[title="message"]').css({
		'border-radius': '25px',
		'position': 'absolute',
		'top': t.toString(),
		'left': l.toString()
	});
	
	moveWindow();
}

function addCanvas(w, h){
	t = 60+30*$('canvas').length;
	l = 200+30*$('canvas').length;
  
	$('#canvasPaper').append(
		'<div class="drag" style="top:'+ t + 'px;left:' +l+'px;position: absolute;">' +
		'<div class="title">X</div>' +
		'<canvas class="workarea" width="'+ w +'" height="'+ h +'"></canvas></div>'
	);
	
	basicDraw($("canvas.workarea").get());
	
	moveWindow();
}

function basicDraw(canvas){
	for(var i =0; i < canvas.length; i++){
		cxt[i] = canvas[i].getContext('2d');	
		
		canvas.onmousedown = function(event){
			isMouseDown = true;
			firstPointX = event.offsetX;
			firstPointY = event.offsetY;
		};
	
		canvas.onmouseup = function(event){
			isMouseDown = false;
			switch(selectedStucks){
				case 'pen':
					drawPath(firstPointX, firstPointY);
					firstPointX = event.offsetX;
					firstPointY = event.offsetY;
					
					break;
				case 'clear':
				case 'shar':
				case 'rect':
				case 'round':
				case 'fill':
				case 'text':
			}
		};
	}
	
}

function drawPath(x, y){
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	cxt.moveTo(firstPointX,firstPointY);
	cxt.lineTo(x,y);
	cxt.stroke();  
}
