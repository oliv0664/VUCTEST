{
	var totalLineCount;
	var count = 0;
	var data;
	var audioCount = 0;
	var endTime;
	var timer = 900000; //skal laves om så det kommer fra serveren
	var x;
	var checkpoint = 0;

	$(function () {
		$('#start').click(function () {
			setTime();

			endTime = checkpoint + timer;
			nextLine(count);
			x = setInterval(countdown, 1000);
			this.remove();
		});


		//lydfil til at afspille opgavebeskrivelsen
		$audioFile = $('<audio/>').attr({
			src: '../audio/brevintro.wav'
		});

		$audioControl = $('<input/>').attr({
			class: 'h3size',
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

		var img = $('<img>').attr({
			src: 'images/audio.png',
			class: 'img'
		}); 

		$('#subsection').prepend($audioControl).prepend(img);



		$('#form').bind('submit', function (event) {
			event.preventDefault(); //this will prevent the default submit

			var answers = [];
			//            for (var i = 0; i <= count; i++) {
			var answer = $('#lockedField').val();
			var point = 0;
			if (answer != null) {
				point = 1;
			}

			var time = $('#timestamp0').val();


			var object = {
				"answer": answer,
				"point": point,
				"time": time
			}

			answers.push(object);
			//            }

			$('#answers').val(JSON.stringify(answers));




			$(this).unbind('submit').submit(); // continue the submit unbind preventDefault
		});
	});


	//hele denne function bliver slet ikke kaldt..
	function initializeTest(data) {

		this.data = data;

		totalLineCount = data.content.length;
		count = 0;
		timer = 900000; // 15 min.
	}





	function nextLine(count) {

		$lineInput = $('<textarea/>')
			.attr({
				class: 'h3size',
				id: 'answer',
				//name: 'userinput',
				placeholder: 'Skriv brev'
			})
			.css({
				'width': '80%',
				'height': '30%'
			});


		$timestamp = $('<input/>').attr({
			type: 'hidden',
			id: 'timestamp' + count
				//name: 'timestamp'
		});


		// tilføjer alle elementer til siden 
		$('#subsection')
			.append($lineInput)
			.append($timestamp)
			.append('<br>');


		$submit = $('<input/>').attr({
			class: 'h3size',
			id: 'saveButton',
			type: 'button',
			value: 'Gem'
		}).click(function () {
			save()
		});

		$('#bottom').append($submit);

	}

	function save() {
		setTime();
		lockTextfield();
		addNextButton();
		$('#saveButton').remove();
	}


	function setTime() {
		var d = new Date();
		var timestamp = (d.getTime() - checkpoint);
		$('#timestamp' + count).val(timestamp);
		checkpoint = d.getTime();
	}


	function lockTextfield() {
		$('#answer').attr({
			readonly: 'readonly',
			id: 'lockedField'
		});
		clearInterval(x);
	}


	function addNextButton() {
		$next = $('<input/>').attr({
			class: 'h3size', 
			type: 'submit',
			value: 'Videre'
		});

		$('#bottom').append($next);
	}


	function countdown() {
		var now = new Date().getTime();
		var distance = endTime - now;
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		$('#timer').text(minutes + ":" + seconds);

		if (distance < 0) {
			clearInterval(x);
			$('#timer').text("Tiden er gået!");
			save();
		}
	}
}