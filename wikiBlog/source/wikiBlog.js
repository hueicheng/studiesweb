window.onload = initPage;
google.load("gdata", "1");
google.load("jquery", "1.4.2");

function initPage(){
	
}

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
	alert(token);
}

function logout(){
	google.accounts.user.logout();
   
}

function editText(){
	
}

function callBack(){}
