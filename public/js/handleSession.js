$(function () {
	console.log('sessionHandler active');
	$('.form').bind('submit', function (event) {
		event.preventDefault(); //this will prevent the default submit

		
		var modules = [];
		var user = JSON.parse(sessionStorage.getItem('currentUser'));
		if (user) {
			var initials = user.username;
			console.log("##### ", initials);
		}




		//             $('#content').val(JSON.stringify(content));

		//             $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
	});
});