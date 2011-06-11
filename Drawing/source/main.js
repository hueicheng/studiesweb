google.load("jqueryui", "1.8");
var serverPSPath = "http://114.35.176.89/studiesweb/saveImage.php";
var lineWidth = 1;	//初始筆粗;
var defaultColor = "#f00";	//預設顏色;
var secondColor = "#00f"	//預設二色;
var canvasNum = 0;	//canvas 的個數;
var canvasFocus = null;	//目前的canvas;
var isDraw = false;	//繪圖狀態;
var isLine;
var isMsg = false;	//訊息狀態;
var fpX, fpY;	//firstPointX, firstPointY;第一個點座標;
var selectedStutes;

function init(){
		
	selectedStutes = "pen";
	$('#pen').addClass('using');
	
	
	$('#menuPane').tabs();
	dropFile( $('#module').get(0) );


	$('img[title=newFile]').click(function(){
		if(!isMsg){
			makeMsgBox();
			$('#menuPane').tabs({selected: 1});
		}
	});
	
	$('img[title=openFile]').click(function(){
		var file = $('<input>',{accept:'image/*', type:"file"}).appendTo($('#tabs-1')).css('visibility', 'hidden');
		file.click();
		file.change(function(){
			readPic(this.files[0]);
			$(this).remove();
		});
	});
	
	$('img[title=saveFile]').click(function(){
		if(canvasFocus != null){
			saveCanvas(canvasFocus, 'png');
		}else{
			msgError('存檔好像有點問題，確定一下圖片吧？');
		}
	});
	
	$('div#edit > img').click(function(){
		selectedStutes = this.id;
		$('div#edit > img').removeClass('using');
		$(this).addClass('using');
	});
	
	$('#colorPicker').css({'background': defaultColor, color: 'rgba(0,0,0,0)'});	
	$('#colorPicker').click(function(){
		makeColorPicker($(this));
	});
	
	$('#colorPicker').before(makeRange(1, 10, 1));
}

function makeColorPicker(contentHTML){
	var colorPi = $('<div>').farbtastic(function(color){
			contentHTML.css('background', color);
			defaultColor = color;
		});
	makeWindow('調色盤', colorPi).dialog({
				width:'auto',
				position: ['right', 'top'],
				resizable: false,
				close:function(){ $(this).remove();}
			});
	
	return colorPi;
}

function makeRange(min, max, step){
	var range = $('<input>',{type:"range",max:max,min:min, step:step, value:1});
	var textNum = $('<input>',{type:'number',max:max, min:min, step:step, size:"4", value:range.val()});
	range.change(function(){
		textNum.val(range.val());
		lineWidth = textNum.val();
	});
	textNum.change(function(){
		range.val(textNum.val());
		lineWidth = range.val();
	});
	return $("<span>").append(range, textNum);
}

function dropFile(element){
	element.ondragenter = function(event){
			this.style.border = '';
			return false;
		};
	element.ondragover = function(event){
			this.style.border = "dashed 5px #3c3c3c";
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
		
		reader.onloadend = function(event){
			img.title = file.fileName;
			img.src = event.target.result;
			
			
		};
		reader.onerror = function(event){
			msgError('讀檔遇到錯誤囉,換張圖試試吧.');
		};
		
		img.onload = function(){
			canvas = makeCanvas(img.title, img.width, img.height, '#fff');
			canvas.get(0).getContext('2d').drawImage(img, 0, 0);
			makeWindow(img.title, canvas).dialog({
					width: 'auto',
					resizable: false,
					focus:function(){ canvasFocus = $(this).children().get(0);},
					close: function(){ $(this).remove(); }
				});
		};
		
		
	}
}

function saveCanvas(canvas, type){		//儲存檔案
	switch(type){
		case 'png':
			pic = Canvas2Image.saveAsPNG(canvas, false);
			//savePic(canvasFocus.title, 'png', pic.src);
			break;
		case 'jpg':
			Canvas2Image.saveAsJPEG(canvas);
			break;
		case 'bmp':
			Canvas2Image.saveAsBMP(canvas);
			break;
		default:
			return msgError('type error');
	}
}

function savePic(fName, pType, pContent){
	$.ajax({
		url: serverPSPath,
		type:"POST",
		data: 'title=' + fName + '&type=' + pType + '&content=' + encodeURIComponent(pContent)
	});
}

function makeMsgBox(){	//建立初始的訊息視窗;
	isMsg = true;
	msgBox = $('<div>').append($('<p>',{html:"title:"}).append($('<input>',{title:"filename",type:"text",size:"6"})),
		$("<p>",{html:"width:"}).append($("<input>",{title:"width",type:"number",min:"300", max:"1280",step:"50",value:"300",size:"6"})),
		$("<p>",{html:"height:"}).append($("<input>",{title:"height",type:"number",min:"150", max:"800",step:"50",value:"150",size:"6"}))
	);
	
	makeWindow('msgbox', msgBox).dialog({
		width:'auto',
		resizable: false,
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
						resizable: false,
						focus:function(){ canvasFocus = $(this).children().get(0);},
						close:function(){
							canvasNum--;
							canvasFocus = (canvasNum != 0)?canvasFocus:null;
							$(this).remove();
						}
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

//...以下是針對Netscape所設計的offset...;
function getOffset(event){	
	var target = event.target;
	if(target.offsetLeft == undefined){
		target = target.parentNode;
	}
	var pageCoord = getPageCoord(target);
	var eventCoord = {
		x:window.pageXOffset + event.clientX,
		y:window.pageYOffset + event.clientY
	};
	var offset = {
		offsetX: eventCoord.x - pageCoord.x,
		offsetY: eventCoord.y - pageCoord.y
	};
	
	return offset;
}

function getPageCoord(element){
	var coord = { x: 0,	y: 0 };
	while(element){
		coord.x += element.offsetLeft;
		coord.y += element.offsetTop;
		element = element.offsetParent;
	}
	
	return coord;
}

//...以上是針對Netscape系列所做的offset...;

function makeCanvas(title, w, h, bgcolor){		//建立畫布的方法;
	canvas = $("<canvas>").css('background', '#fff');
	canvas.get(0).title = title;
	canvas.get(0).width = w;
	canvas.get(0).height = h;
	//canvas.get(0).getContext('2d').fillStyle = bgcolor;
	//canvas.get(0).getContext('2d').fillRect(0,0,w,h);
	
	canvas.mousedown(function(e){
		fpX = e.offsetX?e.offsetX:getOffset(e).offsetX;
		fpY = e.offsetY?e.offsetY:getOffset(e).offsetY;
		isDraw = true;
	});
	canvas.mousemove(function(e){
		if(isDraw && !isLine){
			var thisX = e.offsetX?e.offsetX:getOffset(e).offsetX;
			var thisY = e.offsetY?e.offsetY:getOffset(e).offsetY;
			selectType(this.getContext("2d"), defaultColor, secondColor, lineWidth, thisX, thisY);
		}

	});
	canvas.mouseup(function(e){
		if(isDraw){
			var thisX = e.offsetX?e.offsetX:getOffset(e).offsetX;
			var thisY = e.offsetY?e.offsetY:getOffset(e).offsetY;
			selectType(this.getContext("2d"), defaultColor, secondColor, lineWidth, thisX, thisY);
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
		case 'brushes':
			isLine = false;
			return drawBrushes(cxt, color, 5, 5, x, y);
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
		resizable: false,
		close:function(){$(this).remove();},
		buttons:{
			'雖然很麻煩，不過我知道了':function(e){$(this).remove();}
		}	
	});
}

function drawCleaner(cxt, w, h, x, y){		//清除
	cxt.fillStyle = '#fff';		//這只是暫時的處理方案;
	cxt.fillRect(fpX - w / 2, fpY - h / 2, w, h);
	fpX = x, fpY = y;
}

function drawBrushes(cxt, color,  w, h, x, y){
	cxt.fillStyle = color;
	cxt.fillRect(fpX - w / 2, fpY - h / 2, w, h);
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

function drawText(cxt, color, scolor, type, str){
	cxt.fillStyle = scolor;	
	cxt.strokeStyle = color;
	cxt.font =  lw + 'sans-serif';
	cxt.beginPath();
	switch(type){
		case 'hollowText':
			cxt.strokeText(str, fpX, fpY);
			break;
		case 'solidText':
			cxt.fillText(str, fpX, fpY);
			break;
		case 'twiceText':
			cxt.strokeText(str, fpX, fpY);
			cxt.fillText(str, fpX, fpY);
			break;
		default:
			alert('型態錯誤!');
			break;
	}	
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
			cxt.arc((fpX+x)/2,(fpY+y)/2,Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.stroke();
			break;
		case 'solidCir':
			cxt.arc((fpX+x)/2,(fpY+y)/2,Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
			cxt.fill();
			break;
		case 'twiceCir':
			cxt.arc((fpX+x)/2,(fpY+y)/2,Math.sqrt((x-fpX)*(x-fpX)+ (y-fpY)*(y-fpY)) / 2, 0, Math.PI * 2, false);
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
