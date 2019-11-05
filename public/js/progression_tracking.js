var url = window.location.pathname; 
var user = sessionStorage.getItem('currentUser'); 
user = JSON.parse(user);  

if(user.teacherModules) {
    if(decodeURI(url.slice(1)) != user.teacherModules[0]) {
        location.replace(user.teacherModules[0]); 
    }
} 