google.load("gdata", "1");
google.load("jqueryui", "1.8.12");

var serverPath = "http://114.35.176.89/studiesweb/save.php";
var readData = "";
var name;	//目前讀到的檔案名稱;
var tags = new Array();

$(function(){
	readText("start.txt");
	name = "start.txt";
	makeFileList();
	
	$("a[title=regx]").click(login);
	$("a[title=edit]").click(edit);
});

//檔案清單;
function makeFileList(){
	$.ajax({
		url: "http://114.35.176.89/studiesweb/server.php",
		success: function(data){
			var fs = sortFileList(data.split(" "));
			ul = $("<ul>");
			for(i=0; i<fs.length; i++){
				
				a = $("<a>",{
					title: fs[i].toString(),
					href:"javascript:;",
					html: fs[i].toString()
				}).click(function(){
						name = this.title;
						readText(this.title);
					}).css({color:'#ff9632'});
				li = $("<li>").append(a);
				ul.append(li);
			}
			$('#right').append(ul);
		}
	});
}

//讀取文字
function readText(title){
	$.ajax({
		url: serverPath,
		data:'title=' + title,
		success: function(data){
			
			$('#textPane').html(wiki2html(data));
			readData =  data;
		}
	});
}

function login(){
		$("a[title=regx]").html("登出").click(logout);
}

function logout(){
		google.accounts.user.logout();
		$("a[title=regx]").html("登入").click(login);
}

//編輯
function edit(){
	$.ajax({
		url:'_edit.html',
		success: function(data){
			$('#edit').html(data);
			$('#post').val(readData);
			$('#btnReview').click(reviewText);
			$('#btnSave').click(function(){
				saveText(name,$('#post').val());
			});
		}
	});
}

//預覽
function reviewText(){
	$('#textPane').html(wiki2html($('#post').val()));
}

//儲存
function saveText(title,context){
	$.ajax({
		type:"POST",
		url: serverPath,
		data: 'title=' + title + '&context=' + context,
		success: function(data){
			$('#textPane').html(wiki2html(context));
		}
	});
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
}