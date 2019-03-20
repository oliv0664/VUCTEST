{
    var totalLineCount;
    var count;
    var data;
    var audioCount = 0;
    var d = new Date();
    var startTime;
    var checkpoint;
    var audiofiles = [
        '../audio/0.wav',
        '../audio/1.wav',
        '../audio/2.wav',
        '../audio/3.wav',
        '../audio/4.wav',
        '../audio/5.wav',
        '../audio/6.wav',
        '../audio/7.wav',
        '../audio/8.wav',
        '../audio/9.wav',
        '../audio/10.wav',
        '../audio/11.wav',
        '../audio/12.wav',
        '../audio/13.wav',
        '../audio/14.wav',
        '../audio/15.wav',
        '../audio/16.wav',
        '../audio/17.wav',
        '../audio/18.wav',
        '../audio/19.wav',
        '../audio/20.wav',
        '../audio/21.wav'
    ];

    $(function() {

        createAudio(audiofiles); 

        $('#start').click(function() {
            startTime = d.getTime();
            checkpoint = startTime;

            nextLine(count);
            this.remove();
        });


        //lydfil til at afspille opgavebeskrivelsen
        $audioFile1 = $('<audio/>').attr({
            src: '../audio/introdiktatfvu.wav' //data.file
        });

        $audioControl1 = $('<input/>').attr({
            class: 'h3size',
            type: 'button',
            id: 'audioControl',
            value: 'Afspil'
        }).click(function() {
            $audioFile1[0].play();
        });

        var img = $('<img>').attr({
            src: 'images/audio.png',
            class: 'img'
        });

        $('#subsection').prepend($audioControl1).prepend(img);


         
        $('#form').bind('submit', function(event) {
            setTime();

            event.preventDefault(); //this will prevent the default submit

            var answers = [];

            //count sættes til 25, da vi ved i denne test, at der er 25 svar
            count = 25;

            var len = data.content.length 

            for (var i = 0; i < len; i++) {
                var answer = $('#answer' + i).val();
                answer = answer.trim();
                // answer = answer.toLowerCase();  
                var correct = data.content[i].answer;
                var point = 0;
                if (answer == correct) {
                    point = 1;
                }

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
                src: '../audio/0.wav'
            }); 

        $label = $('<label/>').text(testlist.files[count]);*/


        $audioFile = $('<audio/>').attr({
            src: data.content[count].file
        });

        $audioControl = $('<input/>').attr({
            class: 'h2size',
            type: 'button',
            id: 'audioControl' + count,
            value: 'Afspil'
        }).click(function() {
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



        $('#answer' + count).one('keyup', function() {
            $nextButton = $('<button/>').attr({
                class: 'h2size',
                id: 'button' + count
            });

            if ((count + 1) < totalLineCount) {
                $nextButton
                    .click(function() {
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


}