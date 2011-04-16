google.load("gdata", "1");

$(function(){
	$.get("page/start.txt", function(data){
		var tohtml = wiki2html(data);
		$("div[class=textPane]").html(tohtml);
	});
	
	if(localStorage.token != null){
		$("a[title=login]").hide();
		$("a[title=logout]").show();
	}
	
});

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
	localStorage.token = token;
	//$("a[title=logout]").css("display", "");
	$("a[title=logout]").show();
    
    //$(this).css("display", "none");
    $("a[title=login]").hide();
    
   
}

function logout(){
	google.accounts.user.logout();
    //$("a[title=login]").css("display", "");
    //$(this).css("display", "none");
    $("a[title=login]").show();
    //$(this).hide();
    $("a[title=logout]").hide();
    
    delete localStorage.token;
}

function editText(){
	var dateTime = new google.gdata.DateTime();
   alert(dateTime.getDate());
}

