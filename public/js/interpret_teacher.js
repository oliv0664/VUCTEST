{


    // jquery start function
    $(function () {

        // når der klikkes på denne knap
        $('#addText').click(function () {
            addText();
        });

        $('#addQuestion').click(function () {
            addQuestion();
        });

//        $('#form').bind('submit', function (event) {
//
//            event.preventDefault(); //this will prevent the default submit
//
//            var texts = [];
//            for (var i = 0; i < textCount; i++) {
//                var text = $('#text' + i).val();
//                var file = $('#file' + i).val();
//
//                var object = {
//                    "text": text,
//                    "file": file
//                }
//
//                texts.push(object);
//            }
//
//
//            var questions = [];
//
//            for (var i = 0; i < questionCount; i++) {
//                var question = $('#question' + i).val();
//
//                var answers = [];
//
//                for (var j = 0; j < ids[i]; j++) {
//                    var answer = $('#answer' + i + j).val();
//                    answers.push(answer);
//                }
//                // rightAnswer can also have white spaces infront and at the end thus it should be trimmed with trim();
//                var rightAnswer = $("input[name=correct" + i + "]:checked").next().val().trim();
//                console.log(rightAnswer);
//                var object = {
//                    "question": question,
//                    "answers": answers,
//                    "rightAnswer": rightAnswer
//                }
//                questions.push(object);
//            }
//
//            var content = {
//                "texts": texts,
//                "questions": questions
//            }
//
//            $('#content').val(JSON.stringify(content));
//            console.log(content);
//            $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
//        });

    });


    // holder styr på antal tekststykker
    var textCount = 0;

    // når der trykkes på knappen
    function addText() {

        // opretter et ny div
        $newText = $('<div/>')
            .attr({
                id: 'textDiv' + textCount,
                class: 'fullwidth'
            })
            .text((textCount + 1) + '. ');

        // tilføjer div til body
        $('#subsection').append($newText);



        //størrelsen på tekst input felterne 
        var size = 25;

        // tilføj et tekstfelt
        $newText = $('<textarea/>').attr({
            class: 'h2size',
            id: 'text' + textCount,
            form: 'form',
            name: 'txt' + textCount,
            placeholder: 'Indtast tekst her',
            size: size,
            required: true
        }).css("height", "100px");


        // tilføj en lydfil
        $audioFile = $('<input/>').attr({
            type: 'file',
            class: 'h2size',
            id: 'file' + textCount,
            name: 'file' + textCount,
            accept: 'audio/*',
            onchange: 'readURL(this)',
            required: true
        });


        // tilføj en lydkontroller til den givne lydfil
        $audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr('id', 'soundSrc' + textCount);



        // tilføj alle elementer til siden 
        $('#textDiv' + textCount)
            .append($newText)
            .append($audioFile)
            .append($audioControl);



        // tilføjer en slet knap
        if (textCount == 0) {
            $removeTextButton = $('<input/>').attr({
                class: 'h2size',
                id: 'removeTextButton',
                type: 'button',
                value: 'Fjern tekststykke'
            }).click(function () {
                removeText();
            });


            $('#subsubsection').append($removeTextButton);

        }



        textCount++;
    }



    // holder styr på antal spørgsmål
    var questionCount = 0;
    var ids = [];

    // når der trykkes på knappen
    function addQuestion() {
        ids[questionCount] = 0;

        // opretter en ny div til spørgsmål
        $newQuestionDiv = $('<div/>')
            .attr({
                id: 'questDiv' + questionCount,
                class: 'fullwidth',
                required: true
            })
            .text((questionCount + 1) + '. ');

        // tilføjer div til body
        $('#subsection1').append($newQuestionDiv);



        //størrelsen på tekst input felterne 
        var size = 25;

        $temp = $('<div/>').attr({
            class: 'fullwidth',
            id: 'temp' + questionCount
        });

        // tilføj alle elementer til siden 
        $('#questDiv' + questionCount)
            .append($temp);


        // tilføj et spørgsmål
        $newQuestion = $('<input/>').attr({
            class: 'h2size',
            id: 'question' + questionCount,
            type: 'text',
            name: 'q' + questionCount,
            placeholder: 'Indsæt spørgsmål her',
            size: size
        });


        // tilføj en knap til at lave svarmuligheder
        $newChoiceButton = $('<input/>').attr({
            class: 'h2size',
            id: 'choiceButton' + questionCount,
            type: 'button',
            value: "Tilføj svarmulighed"
        }).click(function () {
            addChoice(this.id);
        });

        $('#temp' + questionCount)
            .append($newQuestion)
            .append($newChoiceButton);





        // tilføjer en slet knap
        if (questionCount == 0) {
            $removeQuestionButton = $('<input/>').attr({
                class: 'h2size',
                id: 'removeQuestionButton',
                type: 'button',
                value: 'Fjern spørgsmål'
            }).click(function () {
                removeQuestion();
            });


            $('#subsubsection1').append($removeQuestionButton);

        }
        questionCount++;
    }



    // tilføj en svarmulighed
    function addChoice(input) {
        var id = input.substring(12);

        $newChoice = $('<input/>').attr({
            class: 'h2size',
            id: 'correct' + ids[id],
            type: 'radio',
            name: 'correct_for_q' + id,
            required: true
        }).val(ids[id]);


        $label = $('<input/>').attr({
            type: 'text',
            class: 'h2size',
            id: 'answer' + id + ids[id],
            name: 'q' + id + ' opt' + ids[id] ,
            placeholder: 'Indtast svarmulighed'
        });

        ids[id]++;

        $('#temp' + id)
            .append('<br>')
            .append($newChoice)
            .append($label);
    }



    // fjerner slet knap når der ikke er flere linjer 
    function removeText() {

        $('#textDiv' + (textCount - 1)).remove();

        textCount--;


        if (textCount == 0) {
            $('#removeTextButton').remove();
        }
    }



    // fjerner slet knap når der ikke er flere linjer 
    function removeQuestion() {

        $('#questDiv' + (questionCount - 1)).remove();

        questionCount--;


        if (questionCount == 0) {
            $('#removeQuestionButton').remove();
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

    // når der trykkes submit


    /*function submit() {
        
        
        var dataArray = []; 
        var lineText1Array = []; 
        var lineTextExampleArray = []; 
        var lineText2Array = []; 
        var audioSrcArray = []; 
        
        // alle de indtastede elementer bliver gemt i arrays
        for(var i=0; i<lineCount; i++) {
            
            lineText1Array[i] = $('#lineText1' + i).val(); 
            lineTextExampleArray[i] = $('#lineTextExample' + i).val(); 
            lineText2Array[i] = $('#lineText2' + i).val();
            audioSrcArray[i] = $('#soundSrc' + i).attr('src'); 
            
        }
        
        // alle arrays bliver til sidst smidt in i et stort array 
        dataArray[0] = lineText1Array;
        dataArray[1] = lineTextExampleArray; 
        dataArray[2] = lineText2Array; 
        //audio kan ikke gemmes i localstorage, venter på opdatering med database
        //dataArray[3] = audioSrcArray; 
        
        
        // gemmer titlen på testen (obligatorisk)
        var testTitle = $('#testTitle').val(); 
        if(testTitle == null) {
            alert('Du skal angive en titel til din test'); 
        } else {
            
            dataArray[3] = testTitle; 
            var output = dataArray;

            
        dette stykke gemmer til localstorage
        *    
        *    // spørger brugeren om deres initialer
        *    initialsMain = prompt('Skriv dine initialer');
        *    initialsMain = initialsMain.replace(/\s+/g, '');
        *    
        *    while(initialsMain.length > 3 || initialsMain.length < 3) {
        *        initialsMain = prompt('Dine initialer skal være 3 bogstaver!'); 
        *    } 
        *
        *    // gemmer testen under den angivne bruger (initialer) 
        *    localStorage.setItem(initialsMain, JSON.stringify(output)); 
        *
        
            
            
            
            // åbner et nyt vindue
            var url = "output.html";
            var openWindow = window.open(url);

            openWindow.dataFromParent = output;
            openWindow.addEventListener('load', function(){
                openWindow.init(); 
            });
            
        }
        
    }*/


}
