var nodemailer = require('nodemailer'); 

module.exports = {
    sendMail: function(mailTo, message) {
        //console.log(results);
        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com 
                pass: 'Outlookvucfyntest2018'  //Gmailvucfyntest2018
            }
        });

        


        var mailOptions = {
            from: 'vucfyn.test@outlook.dk', //vucfyn.diktat.test@gmail.com
            to: mailTo, 
            subject: 'screeningtest resultater',
            // text: JSON.stringify(message)
            html: message
            
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Mail ERROR");
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },


    htmlBuilder: function(results) {

        var html; 
        
        html = `<table border="1" style="border-collapse:collapse">
                <tr>
                    <td>Lærer initialer</td>
                    <td>Kursist ID</td>`;

        for(var i=2; i<results.length; i++) {
            html += '<td>Modultype</td>'; 
            for(var j=0; j<results[i].answers.length; j++) {
                html += '<td>Spørgsmål ' + (j+1) + '</td>'; 
            }
        }

        html += '</tr>'; 

        
        html += '<tr><td>' + results[0] + '</td><td>' + results[1]+ '</td>';

        for(var i=2; i<results.length; i++) {
            html += '<td>' + results[i].type + '</td>'
            
            for(var j=0; j<results[i].answers.length; j++) {
                html += `<td>kursist svar: ` + results[i].answers[j].student_answer + `<br>
                korrekt svar: ` + results[i].answers[j].correct_answer + `</br>
                points: ` + results[i].answers[j].point + `</td>`; 
            }
        }

        return html; 
    
    }
}



function timeConverter(milliseconds) {
    var seconds = milliseconds / 1000; 
    var minutes = Math.floor(seconds / 60);
    var leftoverSeconds = Math.floor(seconds % 60);
    seconds = leftoverSeconds; 

    if(seconds.toString().length < 2) {
        seconds = "0" + seconds; 
    }

    return minutes + ":" + seconds; 
}