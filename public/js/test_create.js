$(function () {
    console.log('det oa;f');
    $('#showTest').click(function () {
        checkInput();
    });

    $('#teacher_data').submit(function () {
        var checked = $("#teacher_data input:checked").length > 0;
        if (!checked) {
            alert("Please check at least one checkbox");
            return false;
        }
    });

});


var initialsIndex;

// viser brugerens tests på baggrund af de indtastede initialer
function checkInput() {

    // fjerner alt indhold fra div bottom 
    $('#bottom').empty();

    // får initialer fra input felt 
    initialsIndex = $('#initialer').val();
    initialsIndex = initialsIndex.replace(/\s+/g, '');

    if (initialsIndex.length < 3 || initialsIndex.length > 3) {
        alert('Dine initialer skal være 3 bogstaver!');
    } else {


        // hvis input = 'oni' 
        // 'oni' er Oliver Wolter Nielsen - administrator 
        if (initialsIndex == 'oni') {
            // vis alle tests i databasen 
            for (var key in localStorage) {
                showTest(key);
            }

            // lav en knap der kan fjerne alle tests 
            $removeButton = $('<br><br><input/>').attr({
                type: 'button',
                id: 'removeButton',
                value: 'Fjern markerede test'
            }).click(function () {
                removeTest();
            });

            $('#bottom').append($removeButton);

            // hvis der ikke findes nogen test med de angivne initialer
        } else if (localStorage.getItem(initialsIndex) === null) {
            alert('Der findes ingen test med disse initialer');

            // hvis der findes en test med de angivne initialer
        } else {

            // hvis testens navn på siden 
            showTest(initialsIndex);

            // lav en knap der gør det muligt at slette tests
            $removeButton = $('<br><br><input/>').attr({
                type: 'button',
                id: 'removeButton',
                value: 'Fjern markerede test'
            }).click(function () {
                removeTest();
            });

            $('#bottom').append($removeButton);
        }
    }
}


var count = 0;

// viser alle test, på baggrund af brugerens initialer
function showTest(initialsToShow) {

    // henter test fra databasen 
    var test = JSON.parse(localStorage.getItem(initialsToShow));
    var testTitle = test[3];

    // udskriver brugerens initialer
    $userInitials = $('<nobr>' + initialsToShow + ' -- </nobr>');

    //udskriver titlen på testen 
    $userTests = $('<nobr>' + testTitle + ' <a href="output.html"><button>Se test</button></a>' + '</nobr>');

    // tilføjer en knap til at fjerne test
    $removeCheckbox = $('<input/><br><br>').attr({
        id: 'removeCheckbox' + count,
        type: 'checkbox',
        name: initialsToShow
    });

    $('#bottom')
        .append($userInitials)
        .append($userTests)
        .append($removeCheckbox);

    count++;
}



// fjerner test på baggrund af markerede checkboxes 
function removeTest() {
    for (var i = 0; i < count; i++) {
        var itemToRemove = $('#removeCheckbox' + i + ':checkbox:checked').attr('name');
        localStorage.removeItem(itemToRemove);
    }
    location.reload(true);
}
