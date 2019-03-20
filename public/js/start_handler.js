$(document).ready(function () {
    $('#start').click(function () {
        start();
    });
});

function start() {
    //start tiden 
    setTime();

    //tilføj første element --> baseret på hvilken testtype
    var url = window.location.pathname.split("/").pop();
    console.log(url);
    switch (url) {
        case 'template':
            $('#test_handler').attr({
                src: '/js/letter_participant.js',
                type: 'text/javascript'
            });
    }

    //når eleven skriver i testen --> tilføj næste knap
    //gem tiden 

    //ved det sidste element --> tilføj videre (submit) knap
    //gem tiden 
}
