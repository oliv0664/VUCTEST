{
    // jquery start function
    $(function () {
        // når der klikkes på denne knap
        $('#addLine').click(function () {
            addLine();
        });
    });


    // holder styr på antal linjer/sætninger
    var lineCount = 0;

    // når der trykkes på knappen
    function addLine() {

        // opretter en ny linje/paragraf
        $newLine = $('<div/>')
            .attr({
                id: 'line' + lineCount,
                class: 'h2size'
            })
            .text((lineCount + 1) + '. ');

        // tilføjer linjen til body
        $('#subsection').append($newLine);



        //størrelsen på tekst input felterne 
        var size = 25;

        // tilføj et tekststykke
        $newLineText1 = $('<input/>').attr({
            class: 'h2size',
            id: 'line1' + lineCount,
            type: 'text',
            name: 'lineText_' + lineCount, //[lineText1]
            placeholder: 'Indtast tekst her',
            size: size,
            required: true
        });


        $newField = $('<label/>').attr({
            class: 'h2size',
            id: 'lineField' + lineCount,
            size: (size - 6),
            required: true
        }).text(" Kursist input ");


        // tilføj endnu et tekststykke
        $newLineText2 = $('<input/>').attr({
            class: 'h2size',
            id: 'line2' + lineCount,
            type: 'text',
            name: 'lineText2_' + lineCount, //[lineText2]
            placeholder: 'Indtast tekst her',
            size: size,
            required: true
        });


        // tilføj en lydfil
        $audioFile = $('<input/>').attr({
            type: 'file',
            class: 'h2size',
            id: 'file' + lineCount,
            name: 'file'+lineCount, //[file]
            accept: 'audio/*',
            onchange: 'readURL(this)',
            // required: true
        }).hide();


        // tilføj alle elementer til siden 
        $('#line' + lineCount)
            .append($newLineText1)
            .append($newField)
            .append($newLineText2)
            .append($audioFile)
            // .append($audioControl);


        // tilføjer en slet knap
        if (lineCount == 0) {
            $removeLineButton = $('<input/>').attr({
                class: 'h2size',
                id: 'removeLineButton',
                type: 'button',
                value: 'Fjern linje'
            }).click(function () {
                removeLine();
            });


            $('#subsubsection').append($removeLineButton);
        }
        lineCount++;
    }

    // fjerner slet knap når der ikke er flere linjer 
    function removeLine() {

        $('#line' + (lineCount - 1)).remove();
        lineCount--;
        if (lineCount == 0) {
            $('#removeLineButton').remove();
        }
    }

    // indlæser en fil, som input af brugeren
    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var fileSrc = input.id.substring(4);

            reader.onload = function (e) {
                $('#soundSrc' + fileSrc)
                    .attr('src', e.target.result)
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    var initialsMain;
}
