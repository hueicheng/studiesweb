window.onload = initPage;
google.load("gdata", "1");
google.load("jquery", "1.4.2");

function initPage(){
	
}

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
}

function logout(){
	
}

function editText(){
	
}

function callBack(){}
