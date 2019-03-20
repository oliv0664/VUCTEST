{
    var totalLineCount;
    var count;
    var data;
    var audioCount = 0;
    var d = new Date();
    var startTime;
    var checkpoint;

    $(function () {
        $('#start').click(function () {
            startTime = d.getTime();
            checkpoint = startTime;

            nextLine(count);
            this.remove();
        });


        //lydfil til at afspille opgavebeskrivelsen
        $audioFile = $('<audio/>').attr({
            src: '../images/aaaah.wav'
        });

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl',
            value: 'Afspil'
        }).click(function () {
            $audioFile[0].play();
        });

        $('#subsection').prepend($audioControl);


        $('#form').bind('submit', function (event) {
            setTime();

            event.preventDefault(); //this will prevent the default submit

            var answers = [];
            for (var i = 0; i <= count; i++) {
                var answer = $('#answer' + i).val();
                answer.trim();
                /*
                 *Hvis der skal laves score til clozetest
                 *var correct = data.content[i].answer;
                 */
                var point = 1;
                /*if (answer == correct) {
                    point = 1;
                }*/

                var time = $('#timestamp' + i).val();


                var object = {
                    "answer": answer,
                    "point": point,
                    "time": time
                }

                answers.push(object);
            }

            $('#answers').val(JSON.stringify(answers));




            $(this).unbind('submit').submit(); // continue the submit unbind preventDefault
        });
    });



    function initializeTest(data) {

        this.data = data;

        totalLineCount = data.content.length;
        count = 0;

    }



    function nextLine(count) {

        // indsætter det første linjestykke
        $lineP1 = $('<nobr/>')
            .attr({
                class: 'h2size'
            })
            .text(data.content[count].line1);

        $lineInput = $('<input/>').attr({
            class: 'h2size',
            id: 'answer' + count,
            //name: 'userinput',
            placeholder: 'Indsæt ord'
        });


        $lineP2 = $('<nobr/>')
            .attr({
                class: 'h2size'
            })
            .text(data.content[count].line2);


        /*$audioControl = $('<audio controls></audio>')
            .append('</source>')
            .attr({
                id: 'soundSrc' + count,
                src: '../images/aaaah.wav'
            }); 

        $label = $('<label/>').text(testlist.files[count]);*/


        $audioFile = $('<audio/>').attr({
            src: '../images/aaaah.wav'
        });

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + count,
            value: 'Afspil'
        }).click(function () {
            $audioFile[0].play();

            if (audioCount > 0) {
                this.remove();
                audioCount = 0;
            } else {
                audioCount++;
            }
            //playAudio($audioFile);  
        });

        $timestamp = $('<input/>').attr({
            type: 'hidden',
            id: 'timestamp' + count,
            //name: 'timestamp'
        });


        // tilføjer alle elementer til siden 
        $('#subsection')
            .append($lineP1)
            .append($lineInput)
            .append($lineP2)
            .append($audioControl)
            //            .append($label)
            .append($timestamp)
            .append('<br>');



        $('#answer' + count).one('keyup', function () {
            $nextButton = $('<button/>').attr({
                class: 'h2size',
                id: 'button' + count
            });

            if ((count + 1) < totalLineCount) {
                $nextButton
                    .click(function () {
                        next();
                    })
                    .text('Næste');
                $('#subsubsection').append($nextButton);
            } else {
                $submit = $('<input/>').attr({
                    type: 'submit'
                });

                $('#bottom').append($submit);
            }


        });
    }


    /*function playAudio(audioFile) {
        audioFile[0].play();
    }*/


    function next() {
        setTime();

        $('#audioControl' + count).remove();
        audioCount = 0;

        count++;

        nextLine(count);

        $('#subsubsection').empty();
    }


    function setTime() {
        var d = new Date();
        var timestamp = (d.getTime() - checkpoint);
        $('#timestamp' + count).val(timestamp);
        checkpoint = d.getTime();
    }


    // kan måske bruges når der skal tjekkes svar !!


    /* $(function() {
         
         // når der klikkes, tjekkes svarene 
         $('#submit').click(function() {
             checkAnswer();     
         });
         
     });
     
     var lineAnswerArray = []; 
     
     // tjekker svar
     function checkAnswer() {
         
         for(var i=0; i<numberOfQuestions; i++) {
             // alle svar bliver sat til små bogstaver, og fjerner mellemrum
             lineAnswerArray[i] = $('#lineInput' + i).val().toLowerCase().trim();
             
             // de korrekte svar bliver ligeledes lavet til små bogstaver, og trimmet
             var correctAnswer = dataFromParent[1][i].toLowerCase().trim()
             
             // sammenligner svar med korrekte svar, og giver feedback 
             // VIGTIGT - skal fjernes når der kommer database 
             if(lineAnswerArray[i] == correctAnswer) {
                 $('#newLine' + i)
                         .css('backgroundColor','lightGreen')
                         .append('   : Det korrekte ord: ' + correctAnswer);
             } else {
                 $('#newLine' + i)
                     .css('backgroundColor', 'lightGrey')
                     .append('   : Det korrekte ord: ' + correctAnswer); 
             }
         }
         
         
     }
     */


}
