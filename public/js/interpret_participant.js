var totalTextCount;
var totalQuestionCount;
var countT = 0;
var countQ = 0;
var data;
var audioCountT = 0;
var audioCountQ = 0;
var d = new Date();
var startTime;
var checkpoint;

$(function() {
    $('#start').click(function() {
        startTime = d.getTime();
        checkpoint = startTime;

        nextText(countT);
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
    }).click(function() {
        $audioFile[0].play();
    });

    $('#subsection').prepend($audioControl);


    $('#form').bind('submit', function(event) {
        event.preventDefault(); //this will prevent the default submit



        var texts = [];
        for (var i = 0; i <= countT; i++) {
            var time = $('#timeText' + i).val();

            var object = {
                "time": time
            }

            texts.push(object);
        }
        var questionCount = $('.question').toArray().length;
        console.log('LUCA IS THE TRUE MASTER: ' + questionCount);
        var questions = [];
        console.log('the answeres will be compared to this: ' + data.content)
        for (var j = 0; j < questionCount; j++) {
            var answer = $("input[name=choice" + j + "]:checked").val().trim();


            console.log('Luca tests the answer: ' + answer);
            //console.log('Luca tests test1: ' + test1Selected);


            var correct = data.content.questions[j].rightAnswer;

            var point = 0;
            if (answer == correct) {
                point = 1;
            }

            var time = $('#timeQuestion' + j).val();


            var object = {
                "answer": answer,
                "point": point,
                "time": time
            }

            questions.push(object);
        }

        var answers = {
            "texts": texts,
            "questions": questions
        }

        $('#answers').val(JSON.stringify(answers));

        console.log('this is uploaded to the db', answers);


        $(this).unbind('submit').submit(); // continue the submit unbind preventDefault

    });
});



function initializeTest(data) {
    console.log("only run once! data= ", data);
    this.data = data;
    console.log("only run uuh..twice!! data= ", data);
    totalTextCount = data.content.texts.length;
    totalQuestionCount = data.content.questions.length;
    //    countT = 0;
    //    countQ = 0;
}



function nextText(countT) {
    console.log("start of nextText: " + countT);
    console.log("totaltextcount: " + totalTextCount);
    // indsætter det første linjestykke
    $textP1 = $('<p></p>')
        .attr({
            class: 'h2size'
        })
        .text(data.content.texts[countT].text).css({
		'width': '50vw',
		'height': '30vh',
		'overflow-y': 'scroll',
		'border': 'solid green',
		'padding': '10px'
	});

    /*$audioControl = $('<audio controls></audio>')
        .append('</source>')
        .attr({
            id: 'soundSrc' + countT,
            src: '../images/aaaah.wav'
        }); 

    $label = $('<label/>').text(data.files[countT]);*/


    $audioFile = $('<audio/>').attr({
        src: '../images/aaaah.wav'
    });

    $audioControl = $('<input/>').attr({
        class: 'h2size',
        type: 'button',
        id: 'audioControl' + countT,
        value: 'Afspil'
    }).click(function() {
        $audioFile[0].play();

        if (audioCountT > 0) {
            this.remove();
            audioCountT = 0;
        } else {
            audioCountT++;
        }
        //playAudio($audioFile);  
    });


    $timestamp = $('<input/>').attr({
        type: 'hidden',
        id: 'timeText' + countT,
        //name: 'timestamp'
    });


    // tilføjer alle elementer til siden 
    $('#subsection')
        .append($textP1)
        .append($audioControl)
        //            .append($label)
        .append($timestamp)
        .append('<br>');


    $nextButton = $('<button/>')
        .attr({
            type: 'button',
            class: 'h2size',
            id: 'nextButton' + countT
        }).text('Næste');

    if (countT < totalTextCount - 1) {
        console.log(countT);
        countT++;
        $nextButton
            .click(function() {
                console.log(countT);
                nextT(countT);
            });
        $('#subsubsection').append($nextButton);
    } else {

        $nextButton
            .click(function() {
                nextQuestion(countQ);
            });
        $('#subsubsection').append($nextButton);
    }
}





/*function playAudio(audioFile) {
    audioFile[0].play();
}*/


function nextT(c) {
    setTimeText();

    $('#audioControl' + c).remove();
    audioCountT = 0;

    $('#subsubsection').empty();
    console.log("nextT: " + c);
    nextText(c);
    console.log('countQ increments to:' + c);
}


function setTimeText() {
    var d = new Date();
    var timestamp = (d.getTime() - checkpoint);
    $('#timeText' + countT).val(timestamp);
    checkpoint = d.getTime();
}






function nextQuestion(countQ) {

    $('#subsubsection').empty();

    // indsætter det første linjestykke
    $question = $('<nobr/>')
        .attr({
            class: 'h2size',
            class: 'question'
        })
        .text(data.content.questions[countQ].question);


    /*$audioControl = $('<audio controls></audio>')
        .append('</source>')
        .attr({
            id: 'soundSrc' + countQ,
            src: '../images/aaaah.wav'
        }); 

    $label = $('<label/>').text(data.files[countQ]);*/


    $audioFile = $('<audio/>').attr({
        src: '../images/aaaah.wav'
    });

    $audioControl = $('<input/>').attr({
        class: 'h2size',
        type: 'button',
        id: 'audioControlQ' + countQ,
        value: 'Afspil'
    }).click(function() {
        $audioFile[0].play();

        if (audiocountQ > 0) {
            this.remove();
            audiocountQ = 0;
        } else {
            audiocountQ++;
        }
        //playAudio($audioFile);  
    });

    $('#subsection')
        .append($question)
        .append($audioControl)

    var len = data.content.questions[countQ].answers.length;
    var con = 0;

    // Generate radiobuttons for each question
    while (con < len) {
        $answerDiv = $('<div/>').attr({
            id: 'answerDiv' + countQ + con
        }).text(
            data.content.questions[countQ].answers[con]
        );

        $choice = $('<input/>').attr({
            type: 'radio',
            id: 'choice' + countQ,
            name: 'choice' + countQ,
            value: data.content.questions[countQ].answers[con]
        });


        $timestamp = $('<input/>').attr({
            type: 'hidden',
            id: 'timeQuestion' + countQ,
            //name: 'timestamp'
        });

        $('#subsection')
            .append($answerDiv)
            .append($choice)
            .append($timestamp)
            .append('<br>');
        con++;
    }


    /*for (var i = 0; i < data.content.questions[countQ].answers.length; i++) {
        /*$answer = $('<nobr/>')
            .attr({
                class: 'h2size'
            })
            .text(data.content.questions[countQ].answers[i]);

        $choice = $('<input/>').attr({
            type: 'radio',
            id: 'choice' + countQ,
            name: 'choice' + countQ
        });

        $('#answerDiv' + countQ).text("hej");
    }*/




    if (countQ < totalQuestionCount - 1) {
        $nextQuestionButton = $('<button/>').attr({
            class: 'h2size',
            id: 'questionButton'
        }).text("Næste spørgsmål");


        // tilføjer alle elementer til siden 
        $('#subsubsection')
            .append($nextQuestionButton)
            .append('<br>');
        $nextQuestionButton
            .click(function() {
                nextQ()
            });
    } else {
        $submit = $('<input/>').attr({
            type: 'submit'
        });

        $('#bottom').append($submit);
        return countQ;
    }








    /*function playAudio(audioFile) {
        audioFile[0].play();
    }*/


    function nextQ() {
        setTimeQuestion();
        $('#subsubsection').empty();
        $('#audioControlQ' + countQ).remove();
        audioCountQ = 0;

        countQ++;

        nextQuestion(countQ);


    }


    function setTimeQuestion() {
        var d = new Date();
        var timestamp = (d.getTime() - checkpoint);
        $('#timeQuestion' + countQ).val(timestamp);
        checkpoint = d.getTime();
    }


}