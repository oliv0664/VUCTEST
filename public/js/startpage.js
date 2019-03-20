$(function() {

    $('.showIfYes').each(function() {
        $(this).hide(); 
    });
    
    $('.checkIfYes').children('select').change(function() {
        if( $(this).val() == "Ja" ) {
            $(this).parent('.checkIfYes').children('.showIfYes').show(); 
        } else {
            $(this).parent('.checkIfYes').children('.showIfYes').hide(); 
        }
    }); 
    

    $('#form').bind('submit', function(event) {
        event.preventDefault(); 

        $('.textarea').each(function() {
            var val = $(this).val();
    
            $(this).next('input').val(val); 
        }); 

        $(this).unbind('submit').submit();

    }); 


}); 