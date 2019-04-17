  function formSetup(myFunc) {
      $('#form').bind('submit', function (event) {
          event.preventDefault();

          $(document.body).css('cursor', 'wait'); 

          if (confirm('Hvis du går videre kan du ikke komme tilbage')) {
              $('#form input[type = submit]').remove();
              //this will prevent the default submit
              console.log('If !undefined, extra code will run: ', myFunc);

              if (myFunc) {
                  myFunc();
              }
              // handle session for teacher site
              sessionTeacher();  
              
              $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
          }

      });
  }

  function sessionTeacher() {

      var user = sessionStorage.getItem('currentUser');
      user = JSON.parse(user);
      if (user) {
          user.teacherModules.shift();
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          $('#data').val(JSON.stringify(user));
      }
  }


  function redirect() {
      var url = window.location.pathname; 
      var user = sessionStorage.getItem('currentUser'); 
      user = JSON.parse(user);  
      if(decodeURI(url.slice(1)) != user.teacherModules[0]) {
          location.replace(user.teacherModules[0]); 
      } 
  }