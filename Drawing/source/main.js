google.load("jquery", "1.6");
google.load("jqueryui", "1.8");
var lineWidth = 1;	//初始筆粗;
var defaultColor = "#ff0000";	//預設顏色;
var secondColor = "#00f"	//預設二色;
var isDraw = false;	//繪圖狀態;
var isMsg = false;	//訊息狀態;
var fpX, fpY;	//firstPointX, firstPointY;第一個點座標;
var selectedStutes;

function init(){
	$('#menuPane').tabs();
	//$('#module').html("hello World;");
	//makeMsgBox();


	$('img[title=newFile]').click(function(){
		if(!isMsg)
			makeMsgBox();
	});
	
	$('div#edit > img').click(function(){
		selectedStutes = this.id;
		$('div#edit > img').removeClass('using');
		$(this).addClass('using');
	});
}

function makeMsgBox(){	//建立初始的訊息視窗;
	isMsg = true;
	msgBox = $('<div>').append($('<p>',{html:"title:"}).append($('<input>',{title:"filename",type:"text",size:"6"})),
		$("<p>",{html:"width:"}).append($("<input>",{title:"width",type:"text",size:"6"})),
		$("<p>",{html:"height:"}).append($("<input>",{title:"height",type:"text",size:"6"}))
	);
	
	makeWindow('msgbox', msgBox).dialog({
		width:'auto',
		buttons:{
				'OK':function(){
					isMsg = false;
					filename = $('input[title=filename]').val();
					h = $('input[title=height]').val();
					w = $('input[title=width]').val();
					canvas = makeCanvas(filename, w, h, "#fff");
					makeWindow(filename, canvas).dialog({
						width:'auto',
						close:function(){$(this).remove();}
					});
					
					$(this).remove();
				},
				'Cancel':function(){
					isMsg = false;
					$(this).remove();
				}
			}
	});
}

function makeWindow(title, contentHTML){	//建立視窗的方法;
	var createDivHead = document.createElement("div");  //創建視窗的標題欄;
	createDivHead.height = 50;
	createDivHead.innerHTML = title  //設定標題;
	var createDivBody = document.createElement("div");  //創建內容容器;
	var createDivMan = document.createElement("div");	//創建整個視窗的容器
	//createDivBody.appendChild(contentHTML);	//把參數內容附加到內容容器中;
	createDivMan.appendChild(createDivHead);  //將標題欄加到視窗容器;
	createDivMan.appendChild(createDivBody);  //將內容加到視窗容器;
	//return createDivMan;	
	
	header = $('<div>',{height:"20",html:title}).css({
		background: '#03f'
	});
	content = $('<div>').append(contentHTML);
	win = $('<div>').append(header, content).draggable({
			headle: 'div',
			opacity: 0.8
		});
	//return win;

	return $('<div>',{title:title}).append(contentHTML);
}

function makeCanvas(title, w, h, bgcolor){		//建立畫布的方法;
	canvas = $("<canvas>").css({background: bgcolor});
	canvas.get(0).width = w;
	canvas.get(0).height = h;
	
	canvas.mousedown(function(e){
		fpX = e.offsetX;
		fpY = e.offsetY;
		isDraw = true;
	});
	canvas.mousemove(function(e){
			if(isDraw == true & selectedStutes == 'pen'){
				drawPath(this.getContext("2d"), lineWidth, e.offsetX, e.offsetY);
			}
		}
	);
	canvas.mouseup(function(e){
		var thisCanvas = this.getContext("2d");		
		if(isDraw == true & selectedStutes != 'pen'){
			switch(selectedStutes){
				case 'line':
					drawLine(thisCanvas, lineWidth, e.offsetX, e.offsetY);
					break;
				case 'rect':
					drawRect(thisCanvas, 1, lineWidth, e.offsetX, e.offsetY);
					break;
				case 'circle':
					drawCircle(thisCanvas, 1, lineWidth, e.offsetX, e.offsetY);
					break;
				default:
					alert('您尚未選擇繪畫方式。');
					break;
			}
		}
		isDraw = false;
	});
	
	return canvas;
}

function drawLine(cxt, lw, x, y){	//畫線方法;
	cxt.strokeStyle = defaultColor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	cxt.moveTo(fpX,fpY);
	cxt.lineTo(x,y);
	cxt.stroke();
	cxt.closePath();
}

function drawRect(cxt, type, lw, x, y){	//距形方法;
	cxt.strokeStyle = defaultColor;
	cxt.fillStyle = secondColor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	switch(type){
		case '1':
			cxt.rect(fpX, fpY, x-fpX, y-fpY);
			cxt.stroke();
			break;
		case '':
			cxt.rect(fpX, fpY, x-fpX, y-fpY);
			cxt.fill();
			break;
		case '':
			cxt.storkeStyle = secondColor;
			cxt.fillStyle = defaultColor;
			cxt.rect(fpX, fpY, x-fpX, y-fpY);
			cxt.stroke();
			cxt.fill();
			break;
		default:
			alert('型態錯誤!');
			break;
	}
	
	cxt.closePath();
}
function drawCircle(cxt, type, lw, x, y){ //圓形方法;
	cxt.strokeStyle = defaultColor;
	cxt.fillStyle = secondColor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	switch(type){
		case '1':
			cxt.arc((fpX+x)/2,(fpY+y),Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.stroke();
			break;
		case '':
			cxt.arc((fpX+x)/2,(fpY+y),Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.fill();
			break;
		case '':
			cxt.arc((fpX+x)/2,(fpY+y),Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.stroke();
			cxt.fill();
			break;
		default:
			alert('型態錯誤！');
			break;
	}
	cxt.closePath();
}
function drawPath(cxt, lw, x, y){
	cxt.strokeStyle = defaultColor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	cxt.moveTo(fpX,fpY);
	cxt.lineTo(x,y);
	fpX = x, fpY = y;
	cxt.stroke();
	cxt.closePath();
}


google.setOnLoadCallback(init);
