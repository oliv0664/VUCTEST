{
    // jquery start function
    $(function () {

        // når der klikkes på denne knap
        $('#addLine').click(function () {
            addLine();
        });

//        $('#form').bind('submit', function (event) {
//
//            event.preventDefault(); //this will prevent the default submit
//
//            var content = [];
//            for (var i = 0; i < lineCount; i++) {
//                var answer = $('#answer' + i).val();
//                var file = $('#file' + i).val();
//
//                var object = {
//                    "answer": answer,
//                    "file": file
//                }
//
//                content.push(object);
//            }
//
//            $('#content').val(JSON.stringify(content));
//
//            $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
//        });
    });


    // holder styr på antal linjer/sætninger
    var lineCount = 0;


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

        $answer = $('<input/>').attr({
            class: 'h2size',
            type: 'text',
            id: 'answer' + lineCount,
            name: 'answer' + lineCount,
            placeholder: 'Indsæt det korrekte ord her',
            size: '25',
            required: true
        });

        // tilføj en lydfil
        $audioFile = $('<input/>').attr({
            class: 'h2size',
            type: 'file',
            id: 'file' + lineCount,
            name: 'file' + lineCount,
            accept: 'audio/*',
            onchange: 'readURL(this)',
            required: true
        });


        // tilføj en lydkontroller til den givne lydfil
        $audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr('id', 'soundSrc' + lineCount);



        // tilføj alle elementer til siden 
        $('#line' + lineCount)
            .append($answer)
            .append($audioFile)
            .append($audioControl);


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
}
