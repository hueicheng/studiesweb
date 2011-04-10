google.load("gdata", "1");

$(function(){
	$.get("../page/about.txt", function(data){
		alert(data);
	});
});

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
	if(token != "")
     $("a[title=logout]").css("display", "");
    
    $(this).css("display", "none");
    
   
}

function logout(){
	google.accounts.user.logout();
    $("a[title=login]").css("display", "");
    $(this).css("display", "none");
}

function editText(){
	var dateTime = new google.gdata.DateTime();
   alert(dateTime.getDate());
}

function test(){ }
