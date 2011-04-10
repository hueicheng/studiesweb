window.onload = initPage;
google.load("gdata", "1");
google.load("jquery", "1.4.2");

function initPage(){
	$('a[title=logout]').css("display='none'");
}

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
	if(token != "")
     $('a[title=logout]').css("display=''");
}

function logout(){
	google.accounts.user.logout();
   
}

function editText(){
	var dateTime = new google.gdata.DateTime();
   alert(dateTime.getDate());
}

function callBack(){}
