google.load("jqueryui", "1.8");
var lineWidth = 1;	//初始筆粗;
var defaultColor = "#f00";	//預設顏色;
var secondColor = "#00f"	//預設二色;
var canvasNum = 0;	//canvas 的個數;
var canvasFocus;	//目前的canvas;
var isDraw = false;	//繪圖狀態;
var isLine;
var isMsg = false;	//訊息狀態;
var fpX, fpY;	//firstPointX, firstPointY;第一個點座標;
var selectedStutes;

function init(){
	var file = $('<input>',{accept:'image/*', type:"file"}).appendTo($('#tabs-1')).css('visibility', 'hidden');
	
	selectedStutes = "pen";
	$('#pen').addClass('using');
	
	$('#menuPane').tabs();
	dropFile( $('#module').get(0) );


	$('img[title=newFile]').click(function(){
		if(!isMsg)
			makeMsgBox();
	});
	
	$('img[title=openFile]').click(function(){
		file.click();
		file.change(function(){
			readPic(this.files[0]);
		});
	});
	
	$('img[title=saveFile]').click(function(){
		saveCanvas(canvasFocus, 'png');
	});
	
	$('div#edit > img').click(function(){
		selectedStutes = this.id;
		$('div#edit > img').removeClass('using');
		$(this).addClass('using');
	});
	
	$('#colorPicker').css({'background': defaultColor, color: 'rgba(0,0,0,0)'});	
	colorPi = $('<div>').append($('<div>').farbtastic(function(color){
				$('#colorPicker').css('background', color);
				defaultColor = color;
			})
	);
	$('#colorPicker').click(function(){
		makeWindow('調色盤', colorPi).dialog({
					width:'auto',
					close:function(){ $(this).remove();}
				});
	});
}



function dropFile(element){
	element.ondragenter = function(event){
			this.style.border = '';
			return false;
		};
	element.ondragover = function(event){
			this.style.border = "dashed 5px #fff";
			return false;
		};
	element.ondragleave = function(event){
			this.style.border = '';
			return false;
		};
	element.ondrop = function(event){
			this.style.border = "";
			readPic(event.dataTransfer.files[0]);
			
			return false;
		};
}

function readPic(file){
	if(!window.FileReader){
		msgError('你的瀏覽器不支援此讀檔喔,換一款試試.');
	}else{
		var reader = new FileReader();
		var img = new Image();
		
		reader.readAsDataURL(file);
		
		reader.onload = function(event){
			img.title = file.fileName;
			img.src = event.target.result;
			
			canvas = makeCanvas(img.title, img.width, img.height, '#fff');
			canvas.get(0).getContext('2d').drawImage(img, 0, 0);
			makeWindow(img.title, canvas).dialog({
					width: 'auto',
					focus:function(){ canvasFocus = $(this).children().get(0);},
					close: function(){ $(this).remove(); }
				});
		};
		reader.onerror = function(event){
			msgError('讀檔遇到錯誤囉,換張圖試試吧.');
		};
		
		
	}
}

function saveCanvas(canvas, type){		//儲存檔案
	switch(type){
		case 'png':
			Canvas2Image.saveAsPNG(canvas);
			break;
		case 'jpg':
			Canvas2Image.saveAsJPEG(canvas);
			break;
		case 'bmp':
			Canvas2Image.saveAsBMP(canvas);
			break;
		default:
			return 'type error';
	}
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
					canvasNum++;
					filename = $('input[title=filename]').val()!=""?$('input[title=filename]').val():"canvas" + canvasNum.toString();
					h = $('input[title=height]').val()!=""?$('input[title=height]').val():"150";
					w = $('input[title=width]').val()!=""?$('input[title=width]').val():"300";
					canvas = makeCanvas(filename, w, h, "#fff");
					makeWindow(filename, canvas).dialog({
						width:'auto',
						focus:function(){ canvasFocus = $(this).children().get(0);},
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

	return $('<div>',{title:title}).append(contentHTML);
}

function makeCanvas(title, w, h, bgcolor){		//建立畫布的方法;
	canvas = $("<canvas>").css('background', '#fff');
	canvas.get(0).width = w;
	canvas.get(0).height = h;
	//canvas.get(0).getContext('2d').fillStyle = bgcolor;
	//canvas.get(0).getContext('2d').fillRect(0,0,w,h);
	
	canvas.mousedown(function(e){
		fpX = e.offsetX;
		fpY = e.offsetY;
		isDraw = true;
	});
	canvas.mousemove(function(e){
		if(isDraw && !isLine){
			selectType(this.getContext("2d"), defaultColor, secondColor, lineWidth, e.offsetX, e.offsetY);
		}

	});
	canvas.mouseup(function(e){
		if(isDraw){
			selectType(this.getContext("2d"), defaultColor, secondColor, lineWidth, e.offsetX, e.offsetY);
		}
		
		isDraw = false;
	});
	canvas.mouseover(function(e){
		isDraw = false;
	});
	
	return canvas;
}

function selectType(cxt, color, scolor, lw, x, y){		//選擇
	switch(selectedStutes){
		case 'pen':
			isLine = false;
			return drawPath(cxt, color, lw, x, y);
		case 'cleaner':
			isLine = false;
			return drawCleaner(cxt, 30, 30, x, y);
		case 'line':
			isLine = true;
			return drawLine(cxt, color, lw, x, y);
		case 'hollowRect':
			isLine = true;
			return drawRect(cxt, color, scolor, 'hollowRect', lw, x, y);
		case 'solidRect':
			isLine = true;
			return drawRect(cxt, color, scolor, "solidRect", lw, x, y);
		case 'twiceRect':
			isLine = true;
			return drawRect(cxt, color, scolor, "twiceRect", lw, x, y);
		case 'hollowCir':
			isLine = true;
			return drawCircle(cxt, color, scolor, "hollowCir", lw, x, y);
		case 'solidCir':
			isLine = true;
			return drawCircle(cxt, color, scolor, "solidCir", lw, x, y);
		case 'twiceCir':
			isLine = true;
			return drawCircle(cxt, color, scolor, 'twiceCir', lw, x, y);
		case 'fill':
			isLine = true;
			return drawFill(cxt,color);
		default:
			if(!isMsg)
				return msgError('好像有點小問題，要不要先換別的？');
			break;
	}
}

function msgError(msg){		//錯誤訊息
	msgerr = $('<div>').addClass('ui-state-error ui-corner-all').append(
		'<p><span class="ui-icon ui-icon-alert"></span><strong>錯誤:</strong>'+msg+'</p>'
	);
	$('<div>',{title:"Error"}).append(msgerr).dialog({
		close:function(){$(this).remove();},
		buttons:{
			'雖然很麻煩，不過我知道了':function(e){$(this).remove();}
		}	
	});
}

function drawCleaner(cxt, w, h, x, y){		//清除
	cxt.clearRect(fpX - w / 2, fpY - h / 2, w, h);
	fpX = x, fpY = y;
}

function drawFill(cxt,color){
	cxt.fillStyle = color;
	cxt.fill();
}

function drawLine(cxt, color, lw, x, y){	//畫線方法;
	cxt.strokeStyle = color;
	cxt.lineWidth = lw;
	cxt.beginPath();
	cxt.moveTo(fpX,fpY);
	cxt.lineTo(x,y);
	cxt.stroke();
	cxt.closePath();
}

function drawRect(cxt, color, scolor, type, lw, x, y){	//距形方法;
	cxt.strokeStyle = color;
	cxt.fillStyle = scolor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	switch(type){
		case 'hollowRect':		//空心方塊;
			cxt.strokeRect(fpX, fpY, x-fpX, y-fpY);
			break;
		case 'solidRect':		//實心方塊;
			cxt.fillRect(fpX, fpY, x-fpX, y-fpY);
			break;
		case 'twiceRect':		//外框實心方塊;
			cxt.storkeStyle = scolor;
			cxt.fillStyle = color;
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
function drawCircle(cxt, color, scolor, type, lw, x, y){ //圓形方法;
	cxt.strokeStyle = color;
	cxt.fillStyle = scolor;
	cxt.lineWidth = lw;
	cxt.beginPath();
	switch(type){
		case 'hollowCir':
			cxt.arc((fpX+x)/2,(fpY+y),Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.stroke();
			break;
		case 'solidCir':
			cxt.arc((fpX+x)/2,(fpY+y),Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.fill();
			break;
		case 'twiceCir':
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
function drawPath(cxt, color, lw, x, y){	//繪製路徑;
	cxt.strokeStyle = color;
	cxt.lineWidth = lw;
	cxt.beginPath();
	cxt.moveTo(fpX,fpY);
	cxt.lineTo(x,y);
	fpX = x, fpY = y;
	cxt.stroke();
	cxt.closePath();
}


google.setOnLoadCallback(init);
