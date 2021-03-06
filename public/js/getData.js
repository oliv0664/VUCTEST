

function readyPage(studentIDs, teacherID) {
    readySidebar(studentIDs, teacherID); 
    readyNavbar(studentIDs, teacherID); 
    getOverviewData(studentIDs, teacherID); 
}


function readySidebar(studentIDs, teacherID) {

    $('.overview').click(function() {
        getOverviewData(studentIDs, teacherID); 
    });

    for(var i=0; i<studentIDs.length; i++) {
        $('#s'+i).click(function() {
            getStudentData(JSON.parse(studentIDs), teacherID, this.id); 
        }); 
    }
}

function getStudentData(studentIDs, teacherID, btnID) {
    var index = btnID.slice(1); 
    var studentID = studentIDs[index];  
    
    $.ajax({
        url: '/getStudentData',
        method: 'GET',
        data: {
            teacherID,
            studentID
        }
    })
    .done(function (dataStr) {
        var data = JSON.parse(dataStr);
        getSidebarView(data); 
    });
}

function getSidebarView(data) {
    var $div1 = $('<div>Kursist ID: '+data[1]+'</div>'); 

    $('#main-content').empty().append($div1, $div2); 

    for(var i=2; i<data.length; i++) {
        if(data[i].type == "kursistinfo") {
            for(var j=0; j<data[i].answers.length; j++) {
                var $div2 = $('<div>'+data[i].answers[j].correct_answer+': '+data[i].answers[j].student_answer+'</div>').attr('class', 'contentDiv');
                var $br = $('<br>'); 
                $('#main-content').append($div2, $br); 
            }
        } else {
            //add 2 buttons for expanding (+) and minimizing (-)
            var $btn1 = $('<button>').text('+').attr('id','expandBtn'+i).css('width','30px').click(function() { showMoreStudentInfo(this.id, data); }); 
            var $btn2 = $('<button>').text('-').attr('id', 'minimizeBtn'+i).css('width','30px').click(function() { showLessStudentInfo(this.id, data); }).hide();
            
            var $div1 = $('<div>').append($btn1, $btn2).attr('class', 'contentDiv');
            var $div2 = $('<div>'+data[i].type+'</div>').attr('class', 'contentDiv');
            var time = calculateMinutesAndSeconds(data[i].time);
            var $div3 = $('<div>Tid: '+time[0]+'min. og '+time[1]+'s.</div>').attr('class', 'contentDiv');     
            var $br = $('<br>').attr('id', 'br'+i); //add break
            
            $('#main-content').append($div1, $div2, $div3, $br); 
        }
    }
}

//this function expands the + button to show student info 
function showMoreStudentInfo(btnID, data) {
    $('#'+btnID).hide();
    var id = btnID.slice(9);  
    $('#minimizeBtn'+id).show(); 

    for(var i=0; i<data[id].answers.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>Kursist svar: '+data[id].answers[i].student_answer+'</div>').attr('class', 'studentData');
        var $div3 = $('<div>Korrekt svar: '+data[id].answers[i].correct_answer+'</div>').attr({class: 'studentData'});
        var $div4 = $('<div>Point: '+data[id].answers[i].point+'</div>').attr({class: 'studentData', id: 'rightContent'});
        
        if(i==0) $div1.append($div2, $div3, $div4).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

function calculateMinutesAndSeconds(timeInMilliseconds) {
    var time = [];
    var seconds = timeInMilliseconds/1000; 

    var minutes = Math.floor(seconds/60);
    time.push(minutes); 

    var secondsLeft = Math.floor(((seconds/60) % 1) * 60);
    time.push(secondsLeft);  

    return time; 
}

//this function minimizes the - button and the student info 
function showLessStudentInfo(btnID, data) {
    $('#'+btnID).hide();
    var id = btnID.slice(11);  
    $('#expandBtn'+id).show();

    for(var i=0; i<data[id].answers.length; i++) {
        $('#div'+id+'-'+i).remove(); 
    }
}




function readyNavbar(studentIDs, teacherID) {
    //ajax call to get data from teacher
    $.ajax({
        url: '/getTestTypes',
        method: 'GET',
        data: {
            teacherID
        }
    })
    .done(function (dataStr) {
        var data = JSON.parse(dataStr); //parse and store all data from teacher
        var ids = JSON.parse(studentIDs); //parse and store array of students
        

        for(var i=0; i<data.length; i++) {
            if(data[i].moduleType != "kursistinfo") {
                $div1 = $('<div>'+data[i].moduleType+'</div>').attr({class: 'nav', id: 'n'+i}).click(function() {
                    getNavbarView(data, ids, teacherID, this.id); 
                }); 
                $('#navbar').append($div1); 
            }
        }
    }); 
}

function getNavbarView(data, studentIDs, teacherID, btnID) {
    var id = btnID.slice(1);

    var $div1 = $('<div>'+data[id].moduleType+'</div>');
    var $br = $('<br>').attr('id', 'br'+id); //add break
    
    $('#main-content').empty().append($div1, $br); 

    //ajax call to get all students from the specific test
    $.ajax({
        url: '/getStudentScore',
        method: 'GET',
        data: {
            teacherID
        }
    })
    .done(function (dataStr) {
        studentData = JSON.parse(dataStr); //parse and store data from all students
  

        if(data[id].moduleType.toLowerCase() == "orddiktat") {
            setWorddictateView(data, studentData, id); 
        } else if(data[id].moduleType.toLowerCase() == "vrøvleord") {
            setNonsenseView(data, studentData, id); 
        } else if(data[id].moduleType.toLowerCase() == "clozetest") {
            setClozetestView(data, studentData, id); 
        } else if(data[id].moduleType.toLowerCase() == "tekstforståelse") {
            setInterpretView(data, studentData, id);
        } else if(data[id].moduleType.toLowerCase() == "brev") {
            setLetterView(studentData, id); 
        }
    }); 
}

function setWorddictateView(data, studentData, id) {
    for(var i=0; i<data[id].content.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+(i+1)+'. '+data[id].content[i].line1+'</div>').attr('class', 'studentData');
        var $div3 = $('<div>'+data[id].contentAnswer[i].answer+'</div>').attr('class', 'studentData');
        var $div4 = $('<div>'+data[id].content[i].line2+'</div>').attr('class', 'studentData');
        
        var totalScore = calculateCorrectAnswers(data, studentData, id, i); 

        var $div5 = $('<div>Kursisterne fik tilsammen '+totalScore+' ud af '+studentData.length+' points</div>').attr({class: 'studentData', id: 'rightContent'});

        if(i==0) $div1.append($div2, $div3, $div4, $div5).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4, $div5).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

function setNonsenseView(data, studentData, id) {
    for(var i=0; i<data[id].content.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+data[id].contentAnswer[i].answer+'</div>').attr('class', 'studentData');
        
        var totalScore = calculateCorrectAnswers(data, studentData, id, i); 

        var $div3 = $('<div>Kursisterne fik tilsammen '+totalScore+' ud af '+studentData.length+' points</div>').attr({class: 'studentData', id: 'rightContent'});
        
        if(i==0) $div1.append($div2, $div3).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

function setClozetestView(data, studentData, id) {
    for(var i=0; i<data[id].content.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+(i+1)+'. '+data[id].content[i].lineText+'</div>').attr('class', 'studentData');
        var $div3 = $('<div> _____ </div>').attr('class', 'studentData');
        var $div4 = $('<div>'+data[id].content[i].lineText2+'</div>').attr('class', 'studentData');
        
        var $div5 = $('<div>Ingen point</div>').attr({class: 'studentData', id: 'rightContent'});
        
        if(i==0) $div1.append($div2, $div3, $div4, $div5).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4, $div5).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

function setInterpretView(data, studentData, id) {
    for(var i=0; i<data[id].content.questions.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+(i+1)+'. '+data[id].content.questions[i].question+'</div>').attr('class', 'studentData');
        var $div3 = $('<div>'+data[id].contentAnswer[i].answer+'</div>').attr('class', 'studentData');
        
        var totalScore = calculateCorrectAnswers(data, studentData, id, i); 

        var $div4 = $('<div>Kursisterne fik tilsammen '+totalScore+' ud af '+studentData.length+' points</div>').attr({class: 'studentData', id: 'rightContent'});
        
        if(i==0) $div1.append($div2, $div3, $div4).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

function setLetterView(studentData, id) {
    for(var i=0; i<studentData.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+studentData[i].studentID+':</div>').attr('class', 'studentData');
        var $div3 = $('<div>'+studentData[i].modules[id].answers[0]+'</div>').attr('class', 'studentData');
        var $div4 = $('<br><br>'); 
        
        if(i==0) $div1.append($div2, $div3, $div4).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4).insertAfter($('#div'+id+'-'+(i-1)));
    }
}


function calculateCorrectAnswers(data, studentData, moduleIndex, contentIndex) {

    var totalScore = 0; 
    var correctAnswer = data[moduleIndex].contentAnswer[contentIndex].answer; 
    
    for(var i=0; i<studentData.length; i++) {
        var studentAnswer = studentData[i].modules[moduleIndex].answers[contentIndex]; 
        if(studentAnswer == correctAnswer) totalScore++; 
    }

    return totalScore; 
}








function getOverviewData(studentIDs, teacherID) {

    $('#main-content').empty(); 

    //ajax call to get data from teacher
    $.ajax({
        url: '/getTestTypes',
        method: 'GET',
        data: {
            teacherID
        }
    })
    .done(function (dataStr) {
        var data = JSON.parse(dataStr); //parse and store all data from teacher
        var ids = JSON.parse(studentIDs); //parse and store array of students
        
        //this function gets data about teacher and students
        //then calculate the scores
        //and then inputs content on the view page 
        getStudentScore(data, teacherID, ids); 
    }); 
}


function getStudentScore(data, teacherID, ids) {
    //ajax call to get data from teacher
    var teacherData; 
    $.ajax({
        url: '/getTeacherScore',
        method: 'GET',
        data: {
            teacherID
        }
    })
    .done(function (dataStr) {
        teacherData = JSON.parse(dataStr); //parse and store data from teacher

        //ajax call to get all students from the specific test
        $.ajax({
            url: '/getStudentScore',
            method: 'GET',
            data: {
                teacherID
            }
        })
        .done(function (dataStr) {
            studentData = JSON.parse(dataStr); //parse and store data from all students

            //for every moduletype from teacher data 
            //create a new array 
            //new array has moduletype, total points available, average score of students, and list of students
            var scoreData = []; 
            for(var i=0; i<teacherData.length; i++) {
                if(teacherData[i].moduleType != "kursistinfo") {
                    var object1 = {
                        moduleType: teacherData[i].moduleType,
                        totalPoints: teacherData[i].contentAnswer.length,
                        averageScore: 0,
                        students: []
                    }
                    
                    //for every student from the current moduletype
                    var totalScore = 0; 
                    var totalTime = 0; 
                    for(var j=0; j<studentData.length; j++) {    

                        //calculate score for the current student and current moduletype 
                        var score = calculateScore(teacherData[i].contentAnswer, studentData[j].modules[i].answers); 
                        totalScore += score; 
    
                        //add all the times together 
                        totalTime += studentData[j].modules[i].time; 
    
                        //every student is stored in an object with ID and score 
                        var object2 = {
                            student: studentData[j].studentID,
                            totalScore: score,
                            totalTime: studentData[j].modules[i].time
                        }
                        object1.students.push(object2);
                        object1.averageScore = (totalScore/studentData.length).toFixed(2); 
                        object1.averageTime = (totalTime/studentData.length).toFixed(2);  
                    }
                    scoreData.push(object1);
                }
            }
            return setView(scoreData, ids); //return a callback function that populates the view with content
        });
    }); 
}

function setView(scoreData, ids) {
    //for every moduletype 
    for(var i=0; i<scoreData.length; i++) {

        //add 2 buttons for expanding (+) and minimizing (-)
        var $btn1 = $('<button>').text('+').attr('id','expandBtn'+i).css('width','30px').click(function() { showMoreInfo(this.id, scoreData); }); 
        var $btn2 = $('<button>').text('-').attr('id', 'minimizeBtn'+i).css('width','30px').click(function() { showLessInfo(this.id, scoreData); }).hide();

        //create a new div 
        //add moduletype and average
        var $div1 = $('<div>').append($btn1, $btn2).attr('class', 'contentDiv'); 
        var $div2 = $('<div>'+scoreData[i].moduleType+'</div>').attr('class', 'contentDiv');
        var $div3 = $('<div>Gennemsnits point: '+scoreData[i].averageScore+' ud af '+scoreData[i].totalPoints+'</div>').attr({class: 'contentDiv', id: 'rightContent'});
        var time = calculateMinutesAndSeconds(scoreData[i].averageTime); 
        var $div4 = $('<div>Gennemsnits tid: '+time[0]+'min. og '+time[1]+'s.</div>').attr({class: 'contentDiv', id: 'rightContent'}); 

        var $br = $('<br>').attr('id', 'br'+i); //add break

        $('#main-content').append($div1, $div2, $div3, $div4, $br); //append data to content div 
        
    }
}

function calculateScore(correctAnswers, studentAnswers) {
    //for every correct answer in the current moduletype
    var score = 0; 
    for(var i=0; i<correctAnswers.length; i++) {
        var correctAnswer = correctAnswers[i].answer; //store correct answer
        var studentAnswer = studentAnswers[i]; //store the student answer 

        if(correctAnswer == studentAnswer) score++;  //if they are equal, increase score 
    }
    return score; 
} 

//this function expands the + button to show student info 
function showMoreInfo(btnID, scoreData) {
    $('#'+btnID).hide();
    var id = btnID.slice(9);  
    $('#minimizeBtn'+id).show(); 

    for(var i=0; i<scoreData[id].students.length; i++) {
        var $div1 = $('<div>').attr('id','div'+id+'-'+i); 
        var $div2 = $('<div>'+scoreData[id].students[i].student+'</div>').attr('class', 'studentData'); 
        var $div3 = $('<div>'+scoreData[id].students[i].totalScore+' ud af '+scoreData[id].totalPoints+'</div>').attr({class: 'studentData', id: 'rightContent'}); 
        var time = calculateMinutesAndSeconds(scoreData[id].students[i].totalTime); 
        var $div4 = $('<div>Tid: '+time[0]+'min. og '+time[1]+'s.</div>').attr({class: 'studentData', id: 'rightcontent'}); 
        
        if(i==0) $div1.append($div2, $div3, $div4).insertAfter($('#br'+id)); 
        else $div1.append($div2, $div3, $div4).insertAfter($('#div'+id+'-'+(i-1)));
    }
}

//this function minimizes the - button and the student info 
function showLessInfo(btnID, scoreData) {
    $('#'+btnID).hide();
    var id = btnID.slice(11);  
    $('#expandBtn'+id).show();

    for(var i=0; i<scoreData[id].students.length; i++) {
        $('#div'+id+'-'+i).remove(); 
    }
}