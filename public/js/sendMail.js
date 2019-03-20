$(function () {

    $('#form').one('click', function(){
        //event.preventDefault(); //this will prevent the default submit
        var mailRecipient = $('#mailReciever').val();
        console.log('you typed: ', mailRecipient);
        $.ajax({
                url: '/send_mail',
                method: 'POST',
                data: {
                    mail: mailRecipient
                },
                error: function (requestObject, error, errorThrown) {
                    console.log('error: ', error);
                    console.log('errorThrown: ', errorThrown);
                    alert('Der skete en fejl');
                }
            })
           .done(function (dataStr) {
               alert('Email er nu sendt til ' + mailRecipient);
           });
    });
})
