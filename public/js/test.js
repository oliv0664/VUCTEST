
$(function () {
	console.log('ready');
	
	
	$('.ul_btn').click(function () {
		var x = $(this).siblings("ul:first");
		console.log(x);
		x.toggle();
		if ($(this).html() == '+') {
			$(this).html('-');
		} else {
			$(this).html('+');
		}

	});
	$('.seeAnswer').click(function(){
		var val = $(this).val();	
//	alert(val + " skal sendes med videre til næste side");
		window.location.href = '/test_da'+val;
	});
	
});

function newTest() {
	window.location.assign("index");
}

function initializeTest(testList) {
	console.log(testList[0].title);
	$('#main').append('<p>' + testList[0].title + '</p>');
}