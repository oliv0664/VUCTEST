	function handleLogin() {
	    console.log('checking log in');
	    var user = JSON.parse(sessionStorage.getItem('currentUser'));
	    var initials = user.username;
	    if (initials != null) {
	        console.log('client is logged in as: ' + initials);
	        if (initials == 'MMR') {
	            $('.MMR').css('display', 'block');
	            return initials;
	        } else {
	            return initials;
	        }

	    } else {
	        alert('log ind!');
	        //		location.href = '/';
	    }
	}