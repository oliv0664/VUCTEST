{

    // jquery start function
    $(function () {

        // når der klikkes på denne knap
        $('#addLine').click(function () {

            if(lineCount >= 99) {
                alert("du kan ikke lave flere linjer");
            } else {
                addLine();
            }

        });
    });


    // holder styr på antal linjer/sætninger
    var lineCount = 0;

    // TO DO...
    // der må ikke oprettes over 99 (> 99) entries 

    // når der trykkes på knappen
    function addLine() {

        // opretter en ny linje/paragraf
        $newLine = $('<div/>')
            .attr({
                id: 'line' + lineCount,
                class: 'h2size'
            })
            .text((lineCount + 1) + '. ')
            .css({
                'margin-top': '50px',
                'margin-bottom': '100px'
            });

        // tilføjer linjen til body
        $('#subsection').append($newLine);


        //størrelsen på tekst input felterne 
        var size = 25;

        // tilføj et tekststykke
        $newLineText1 = $('<input/>').attr({
            class: 'h2size',
            id: 'line1_' + lineCount,
            type: 'text',
            name: 'lineText_' + lineCount,
            placeholder: 'Indtast tekst her',
            size: size,
            required: true
        });


        $newLineTextAnswer = $('<input/>').attr({
            class: 'h2size',
            id: 'answer' + lineCount,
            type: 'text',
            name: 'lineTextAnswer_' + lineCount, 
            placeholder: 'Indsæt det korrekte ord',
            size: (size - 6),
            required: true
        });


        // tilføj endnu et tekststykke
        $newLineText2 = $('<input/>').attr({
            class: 'h2size',
            id: 'line2_' + lineCount,
            type: 'text',
            name: 'lineText2_' + lineCount,
            placeholder: 'Indtast tekst her',
            size: size,
            required: true
        });


        // tilføj en lydfil
        $audioFile = $('<input/>').attr({
            type: 'file',
            class: 'h2size',
            id: 'file' + lineCount,
            name: 'file' + lineCount, //[file]
            accept: 'audio/*',
            onchange: 'readURL(this)',
            // value: './public/audio/dummy.mp3',
            required: true
        });

        // tilføj en lydkontroller til den givne lydfil
        // $audioControl = $('<audio controls></audio>')
            // .append('</source>')
            // .attr('id', 'soundSrc' + lineCount);


        // tilføj alle elementer til siden 
        $('#line' + lineCount)
            .append($newLineText1)
            .append($newLineTextAnswer)
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


    var audioFiles = []; 

    // indlæser en fil, som input af brugeren
    function readURL(input) {
        console.log("file input " + input); 
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var fileSrc = input.id.substring(4);

            reader.onload = function (e) {
                $('#soundSrc' + fileSrc)
                .attr('src', e.target.result)
            };
            
            console.log("input.files ", input.files[0]); 

            reader.readAsDataURL(input.files[0]);

            var audioFile = {
                id: fileSrc,
                name: input.files[0].name,
                file: input.files[0]
            }; 

            audioFiles.push(audioFile); 
        }
        console.log("audiofile ", audioFile); 
    }
}
