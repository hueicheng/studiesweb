google.load("jqueryui", "1.8.2");

$(function(){

	
	$("#toolbar a").click(function(){
		$('a').removeClass('using');
		$(this).addClass('using');
		selectedStucks = $(this).attr('title');
	});
	
	moveWindow();
	
	$('a[title="newFile"]').click(addMessageBox);
});

function moveWindow(){
	//重複太高所以另寫，雖然很幹;
	$('div.drag').draggable({
		handle: 'div.title',
		cursor: 'move',
		zIndex: 3,
		stop: function(event, ui){
			$('div.drag').css('z-index', '1');
			$(this).css('z-index', '2');
		}
	});
}
