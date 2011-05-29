google.load("gdata", "1");
google.load("jqueryui", "1.8.12");

var serverPath = "http://114.35.176.89/studiesweb/save.php";
var readData = "";
var name;	//目前讀到的檔案名稱;

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
			var fs = sortFile(data.split(" "));
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

function sortFile(FS){
	var comName = ["admin","browser","html4","html5","css","js","jquery","json","rss","sqlite","svg","xml"];
	var CN = new Array();
	var index = 0;
	var m = 0;
	for(i = 0; i < comName.length; i++){
		for(j = 0; j < FS.length; j++){
				var ss = FS[j].split("_");
				if( comName[i] == ss[m] ){
					CN[index] = FS[j];
					index += 1;
				}
		}
	}
	return CN;
}
