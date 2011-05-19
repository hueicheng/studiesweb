google.load("gdata", "1");
google.load("jqueryui", "1.8.12");

$(function(){
	
	var calendarService =
		new google.gdata.calendar.CalendarService('com.appspot.interactivesampler');

	readText("page/start.txt");
	
	$("a[title=regx]").click(login);
	if(localStorage.token != null){
		alert(localStorage.token);
		$("a[title=regx]").html("logout").click(logout);
	}
	
	$('#listUL a').attr('href','#');
	
	$('#listUL a').click(function(){
		var u = "page/" + $(this).text();
		readText(u);
	});
});

function readText(url){
	$.ajax({
		url: url,
		success: function(data){
			$('#textPane').html(wiki2html(data));
		}
	});
}

function login(){
	
	var scope = "http://www.google.com/calendar/feeds/";
	var token = google.accounts.user.login(scope);
	localStorage.token = token;	
    
   
}

function logout(){
	google.accounts.user.logout();
    
    $("a[title=regx]").html("login").click(login);
    
    delete localStorage.token;
}

function editText(){
	var dateTime = new google.gdata.DateTime();
   alert(dateTime.getDate());
}

