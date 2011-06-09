var serverPath = "http://114.35.176.89/studiesweb/readed.php";
var serverFLPath = "http://114.35.176.89/studiesweb/fileList.php";
var serverSFPath = "http://114.35.176.89/studiesweb/saveFile.php";
var artText = "";
var selectedArt = "";

$(function(){
	
	$('#topPane a').attr('href', 'javascript:;');
	$('a[title=newPaper]').click(function(){
			$('#mainPane').empty();
			artText = "";
			selectedArt = "";
			makeEditor();
		});
	$('a[title=drawing]').click(function(){
			window.open('../Drawing/index.html');
		});
	
	readFile('start.txt');
	selectedArt = 'start.txt';
	
	makeFileList();
});

function makeAccordion(title, contentHTML){
	h = $('<h3>').append($('<a>', {href:'javascript:;', html: title}));
	return 	h.after($('<div>').append(contentHTML));
};

function insertText(target, str){
	if(document.selection){	//for IE
		target.focus();
		var sel = document.selection.creatRange();
		sel.text = str
		
		return sel.text;
	}else{		//for other
		var prefix = target.value.substring(0, target.selectionStart);
		var suffix = target.value.substring(target.selectionEnd);
		target.value = prefix + str + suffix;
		
		return target;
	}
}


//將沒有大標題的檔案名稱往前移
function sortFileList(fs){
  fs.sort(); //排列
  var com;
  var str1 = new Array(); //存放無大標題的檔案名稱
  var str2 = new Array(); //存放有大標題的檔案名稱
  var index1 = 0,index2 = 0;
  
  for(i = 1; i < fs.length; i++){
    var ss = fs[i].split("_");
    if( ss[0] == 0 || ss.length < 2){ //切割之後是否為空或者是無"_"                
      str1[index1] = fs[i];
      index1 += 1;
    }
    else{
      str2[index2] = fs[i];
      index2 += 1;
    }  
  }
  saveFileTag(str2);
  com = str1.concat(str2);  //將str2接在str1陣列後
  return com;
}

function saveFileTag(str){
  var index = 0;
  var tags = new Array();
  
  for(i = 0; i < str.length; i++){
    var ss = str[i].split("_");
	
    if( index > 0 && tags[index-1] == ss[0] ){ //相同值跳過
      continue;
    }
    else{ //不同在存放到陣列
      tags[index] = ss[0];
	  index += 1;
    }
  }
  
  return tags;
}


//檔案清單;
function makeFileList(){
	$.ajax({
		url: serverFLPath,
		success: function(data){
			var fs = sortFileList(data.split(" "));
			var tags = saveFileTag(fs);
			for(i = 0; i < tags.length; i++){
				ul = $('<ul>');
				for(j = 0; j < fs.length; j++){
					a = $("<a>",{
						title: fs[j].toString(),
						href:"javascript:;",
						html: fs[j].toString()
					}).click(function(){
							selectedArt = this.title;
							readFile(this.title);
						});
					if(fs[j].indexOf(tags[i]) == 0){
						ul.append($("<li>").append(a));
					}
				}
				$('.centerInfo nav').append(makeAccordion(tags[i], ul))
			}
			$('.centerInfo nav').accordion({ 
					collapsible: true ,	
					autoHeight: false
				});
		}
	});
}

function reviewText(title, text){
	arc = addArticle(title, wiki2html(text));
	$('#mainPane').html(arc);
}

function makeDrawMsgBox(){	//建立繪圖的訊息視窗;
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
						},
						buttons:{
							"完成！":function(){
									canvas = $(this).children().get(0);
									drawingData = canvas.toDataURL();
									str = "[[image " + drawingData + "]]";
									$('textarea[title=Editor]').focus();
									insertText($('textarea[title=Editor]').get(0), str);
									
									$(this).remove();
									
								},
							"取消": function(){ $(this).remove(); }
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

function makeEditor(){
	isMsg = true;
	title = $("<p>",{html:"標題："}).append($('<input>',{type:'text'}).val(selectedArt));
	editor = $('<textarea>',{title:"Editor", width: '550', height: '200'}).val(artText);
	
	div = $('<div>').append(title, editor);
	
	makeWindow('Editor', div).dialog({
			width: 'auto',
			position: ['right', 'bottom'],
			close: function(){ 
					isMsg = false;
					readFile(selectedArt, artText);
					$(this).remove();
				},
			buttons:{
				"繪圖":function(){
						makeDrawMsgBox();
					},
				"預覽":function(){
						reviewText(
							$(this).find('input:text').val(),
							$(this).find('textarea').val()
						);
					},
				"存檔":function(){
						isMsg = false;
						selectedArt = $(this).find('input:text').val();
						artText = $(this).find('textarea').val();
						saveFile(selectedArt, artText);
						$(this).remove();
					},
				"取消":function(){
						isMsg = false;
						reviewText(selectedArt, artText);
						$(this).remove();
					}
			}
		});
}

function addArticle(title, context){
	section = $('<section>');
	header = $('<header>').append($("<h1>",{html: title}));
	arcitle = $('<arcitle>').html(context);
	
	edit = $('<li>').append($("<a>",{title:'edit', html:"編輯", src:"javascript:;"}).click(function(){
				if(!isMsg){
					makeEditor();
				}
			})
		);
	footer = $('<footer>').append(
		$('<ul>').append(edit)
	);
	$('a[title=edit]').attr('href','javascript:;').click(function(){
			if(!isMsg){
				makeEditor();
			}
		});
	
	return section.append(header, arcitle, footer);
}

function readFile(fName){
	$.ajax({
		url: serverPath,
		data: 'title=' + fName,
		success: function(data){
			artText = data;
			$('#mainPane').html(addArticle(fName, wiki2html(data)));
		}
	});
}

function saveFile(fName, fContent){
	$.ajax({
		url: serverSFPath,
		type:"POST",
		data: 'title=' + fName + '&content=' + fContent,
		success: function(data){
			//alert(data);
		}
	});
}
