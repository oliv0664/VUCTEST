var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');
var empty = require('empty-folder');
var url = require('url');

var mailSender = require('./../public/js/email_handler');
var teacherClass = require('./../public/models/teacherSchema.js');
var teacher = new teacherClass();
var studentClass = require('./../public/models/studentSchema.js');
var mongo = require('./../public/js/mongoHandler.js');
var mongoose = require('mongoose');


// %%% Skal gemmes i sessionStorage
var teacherID;
var studentID;
var initials;
var teacherModules = [];
var studentModules = [];
var kursistModules = [];
// denne variabel er navngivet dårligt, men den holder på samme data som initials. 
var tjek;

/* GET home page. */


router.get('/', function(req, res, next) {
    initials = "";

    res.render('login', { //login
        title: 'Express'

    });
});
router.get('/start', function(req, res, next) {

    res.render('start', { //login
        title: 'Start'
    });
});

router.post('/signin', function(req, res, next) {

    var user = req.body.uname;
    var password = req.body.psw;


    console.log('user: ' + user + ' with password: ' + password);

    if (!user || !password) {
        res.redirect('/');
    } else {
        teacherClass.findOne({
            initials: user
        }, {}, function(err, teacher) {
            if (err) {
                res.redirect('/');
            } else {

                if (teacher) {
                    console.log('her er din teacher', teacher);
                    if (teacher.password != password)
                        res.redirect('/');
                    else {

                        //Skal laves om så 'user' sendes til GET request som i test_data
                        //her kan det så sendes til klienten, som kan gemme det i sessionStorage som objekt

                        // res.redirect(url.format({
                        //     pathname: '/start',
                        //     query: {
                        //         'user': user
                        //     }
                        // }));

                        //ved get start skal der laves
                        // var user = req.query.user;

                        res.cookie('username', user);
                        res.redirect('start');
                    }

                } else {
                    res.redirect('/');
                }
            }
        })
    }
});


router.get('/index', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
    teacherModules = [];
});

router.post('/oversigt_info', function(req, res, next) {
    // tjek = req.body.init_field;
    var initials = req.body.data;
    console.log("KIG HER 1");
    console.log(initials);
    res.redirect(url.format({
        pathname: '/oversigt',
        query: {
            'data': initials
        }
    }));
});

router.get('/oversigt', function(req, res, next) {

    var initials = req.query.data;

    teacherClass.findOne({
        "initials": initials
    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {
            console.log(teacher);
            if (teacher != null) {

                console.log("KIG HER 2 " + teacher);
                console.log("KIG HER 2 " + teacher.totalTests);
                console.log("KIG HER 2 " + teacher.tests);
                res.render('oversigt', {
                    title: 'Express',
                    content: teacher
                });
            } else {
                res.send("Der er ingen tests tilknyttet disse initialer endnu!");
            }
        }
    });
});


router.post('/show_answers', function(req, res) {
    console.log("SHOW ", Object.keys(req.body)[0]);
    var data = Object.keys(req.body)[0];

    res.redirect(url.format({
        pathname: '/test_data',
        query: {
            'data': data
        }
    }));
});

router.get('/test_data', function(req, res, next) {
    console.log("POSTED VALUE " + req.query.data);
    var idTeacher = req.query.data;

    studentClass.find({
        "teacherID": idTeacher
    }, function(err, student) {
        if (err) {
            console.log(err);
        } else {
            console.log("TEACHER ID FROM STUDENT DB 2019 ", student);

            var studentIDs = [];

            for (var i = 0; i < student.length; i++) {
                studentIDs.push(student[i].studentID);
            }

            res.render('test_data', {
                title: 'Test data',
                content: {
                    idTeacher: idTeacher,
                    studentIDs: studentIDs
                }
            });
        }
    });
});

router.get('/filepicker', function(req, res, next) {
    res.render('filepicker', {
        title: 'Filepicker'
    });
});
router.get('/error', function(req, res, next) {
    res.render('error', {
        title: 'page not found'
    });

});


/* TEMPLATE */
//router.get('/template', function (req, res) {
//    var db = req.db;
//    var collection = db.get('letter');
//
//    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
//    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
//    collection.find({
//        'initials': initials
//    }, {}, function (e, docs) {
//        var docLenght = docs.length;
//        res.render('template', {
//            "testlist": docs[docLenght - 1],
//            title: 'TEMPLATE'
//        });
//    });
//});
function setupStudentModules(modulesArray) {
    var tempArray = [];
    for (var i = 0; i < modulesArray.length; i++) {
        console.log("MODULETYPE " + modulesArray[i].moduleType);
        tempArray.push(modulesArray[i].moduleType + '_kursist');
    }
    tempArray.push('finalpage');
    return tempArray;
}

function getId() {
    var id = '5a785e4b3867e72b94b2baba';
    console.log('getID is running');
    return id;
}

var testIndex;

function getTestIndex() {
    return testIndex;
}

function setTestIndex(index) {
    testIndex = index;
}


router.post('/welcome_addinfo', function(req, res) {

    //var db = req.db;


    // %%% Skal gemmes i Sessionstorage
    studentID = req.body.id;
    teacherID = JSON.parse(req.body.data);


    console.log(studentID + " YNLPYPHTASCSACASC");
    console.log(teacherID + " YNLPYPHTASCSACASC");

    //var collection = db.get('students');
    teacherClass.find().where({
        'tests._id': teacherID
    }).exec(function(err, teacher) {
        if (err) {
            res.send(err);
        } else {
            console.log(teacher);
            // find relevnt teacher data to student 
            console.log(teacher[0].tests[0].modules[0].moduleType);
            // make student object with data
            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {

                var id_db = JSON.stringify(teacher[0].tests[i]._id);
                if (id_db == id_serv) {

                    kursistModules = setupStudentModules(teacher[0].tests[i].modules);

                    studentClass.findOneAndUpdate({
                        studentID: studentID
                    }, 'modules', function(err, student) {
                        if (err) {
                            res.send(err);
                        } else {

                            if (!student) {
                                student = new studentClass({
                                    studentID: studentID,
                                    teacherID: teacherID,
                                    studentinfo: {},
                                    modules: []
                                });
                                console.log("STUDENT: ", kursistModules);

                                student.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    res.redirect(kursistModules[0]);
                                    kursistModules.shift();
                                });
                            } else {
                                res.send('ID ER TAGET!');
                            }
                        }
                    });

                }

            }

        }

    });
});

router.post('/index_addinfo', function(req, res) {

    var form = new formidable.IncomingForm();


    form.parse(req, function(err, fields, files) {
        console.log("&&& ", JSON.parse(fields.data));
        var data = JSON.parse(fields.data)

        var initials = data.username;
        var teacherModules = data.teacherModules;
        // teacherModules.push('nextpage');

        console.log("TEACHERMODULES ", teacherModules);
        console.log("INITIALs ", initials);

        teacherClass.findOne({
            initials: initials
        }, function(err, teacher) {
            if (err) {
                console.log(err);
            } else {

                //hvis der ikke eksisterer en teacher med de initialer
                if (!teacher) {
                    console.log("NEW TEACHER");
                    //opret en ny
                    teacher = new teacherClass({
                        initials: initials,
                        totalTests: 1,
                        tests: []
                    });
                    //ellers tilføj til eksisterende
                } else {
                    console.log("ADD TO EXISTING TEACHER");
                    teacher.totalTests++;
                }

                //push en ny test i tests arrayet
                teacher.tests.push({
                    date: new Date(),
                    totalModules: teacherModules.length - 1,
                    modules: []
                });

                //gem til db og redirect view 
                teacher.save(function(err, test) {
                    if (err) {
                        console.log(err);
                    } else {
                        setTestIndex(test.tests[test.tests.length - 1].id)
                        console.log("SAVED: " + test.tests[test.tests.length - 1].id);
                        res.redirect(teacherModules[0]);
                        teacherModules.shift();
                    }
                });
            }
        });
    });
});



router.get(encodeURI('/kursistinfo_lærer'), function(req, res) {
    res.render('kursistinfo_lærer', {
        title: 'Kursistinfo'
    });
});

router.post(encodeURI('/kursistinfo'), function(req, res) {

    var mod;
    var initials;
    var teacherModules;

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        console.log("INFO INFO INFO ", fields);

        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        console.log(initials);
        teacherModules = data.teacherModules;

        var temp = Object.keys(fields);
        console.log("INFO INFO INFO 222222 ", temp);

        var inputContent = [];
        var contentAnswer = [];

        for (var i = 0; i < temp.length; i++) {
            var type = temp[i].split(' ');
            if (type[0] == 'text') {
                var object = {
                    type: 'text',
                    input: fields[temp[i]]
                };
                inputContent.push(object);
            } else {
                var object = {
                    type: type[0],
                    input: fields[temp[i]]
                }
                var last = temp[i].split(' ');
                var choices = [];
                console.log("1 ", i);
                i++;
                console.log("2 ", i);
                while (last[1] == type[1]) {
                    choices.push(fields[temp[i]]);
                    i++;
                    if (i == temp.length) {
                        break;
                    }
                    last = temp[i].split(' ');
                    console.log("3 ", i);
                }
                i--;
                object.choices = choices;
                inputContent.push(object);
            }

            console.log("YAYAYAYAAYAYAYAYA ", inputContent);

            //inputElements.push(fields[temp[i]]); 
            contentAnswer.push({
                index: 'answer' + i
            });
        }

        mod = {
            moduleType: 'kursistinfo',
            content: inputContent,
            contentAnswer
        }


        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });


});




/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter hjemmesiden 'worddictate_teacher' 

router.get(encodeURI('/orddiktat_lærer'), function(req, res) {
    res.render('orddiktat_lærer', {
        title: 'Orddiktat'
    });
});

router.post(encodeURI('/orddiktat'), function(req, res) {

    var initials;
    var teacherModules;
    //this code uploads all files from view to readFrom folder
    //then it uploads all files to MongoDB
    //mangler en bedre navngivning af filer i DB, så de kan findes igen 

    // arrays that should hold data fields from the client form
    var inputContent = [];
    var inputContentAnswers = [];

    // 
    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    // var parsePromise = new Promise(function(resolve, reject) {

    form.parse(req, function(err, fields, files) {

        console.log("asdasdasdasdasdasd", fields);

        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        teacherModules = data.teacherModules;

        // organize data fields into temporary arrays for reference 
        var tempInputContent = Object.keys(fields).filter(input => input.length < 12);
        var tempInputContentAnswers = Object.keys(fields).filter(input => input.length > 12);

        var j = 0;
        for (i = 0; i < tempInputContentAnswers.length * 2; i = i + 2) {
            console.log("I " + i);
            // here we use reference to get the exact property from the object 
            // remember answers are separated 
            inputContent.push({
                index: "question " + j,
                line1: fields[tempInputContent[i]],
                line2: fields[tempInputContent[i + 1]]
            });

            inputContentAnswers.push({
                index: "answer " + j,
                answer: fields[tempInputContentAnswers[j]]
            });
            j++;
        }
        // resolve(); 
    });
    // });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    // parsePromise.then(function(result) {
    console.log("JEG GIDER IKKE VENTE");
    formHandler(req.url, form, inputContent, inputContentAnswers, function(mod) {

        // find the correct teachers test 

        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + initials);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });

});

// });

/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE*/

router.get(encodeURI('/vrøvleord_lærer'), function(req, res) {
    res.render('vrøvleord_lærer', {
        title: 'Vrøvleord'
    });
});

router.post(encodeURI('/vrøvleord'), function(req, res) {

    var initials;
    var teacherModules;

    var inputContent = [];
    var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    form.parse(req, function(err, fields, files) {

        console.log("FIELDS: ", fields);

        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        teacherModules = data.teacherModules;

        // organize data fields into temporary arrays for reference 
        var tempInputContentAnswers = Object.keys(fields);

        for (i = 0; i < tempInputContentAnswers.length; i++) {
            console.log("I " + i);
            // here we use reference to get the exact property from the object 
            // remember answers are separated 
            inputContent.push({
                index: "question " + i
            });

            inputContentAnswers.push({
                index: "answer " + i,
                answer: fields[tempInputContentAnswers[i]]
            });
        }

    });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    formHandler(req.url, form, inputContent, inputContentAnswers, function(mod) {

        // find the correct teachers test 
        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });
});




/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST*/


router.get(encodeURI('/clozetest_lærer'), function(req, res) {
    res.render('clozetest_lærer', {
        title: 'Clozetest'
    });
});


router.post(encodeURI('/clozetest'), function(req, res) {

    var initials;
    var teacherModules;

    var inputContent = [];
    var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    form.parse(req, function(err, fields, files) {

        console.log("FIELDS: ", fields);

        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        teacherModules = data.teacherModules;

        // organize data fields into temporary arrays for reference 
        var tempInputContent = Object.keys(fields);
        var j = 0;
        for (i = 0; i < tempInputContent.length; i = i + 2) {
            console.log("I " + i);
            // here we use reference to get the exact property from the object 
            // remember answers are separated 
            inputContent.push({
                index: "question " + j,
                lineText: fields[tempInputContent[i]],
                lineText2: fields[tempInputContent[i + 1]]
            });

            inputContentAnswers.push({
                index: "answer " + j
            });
            j++;
        }

    });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    formHandler(req.url, form, inputContent, inputContentAnswers, function(mod) {

        // find the correct teachers test 
        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });
});


/* ALLE FUNKTIONER DER ER TILKNYTTET INTERPRET*/


router.get(encodeURI('/tekstforståelse_lærer'), function(req, res) {
    res.render('tekstforståelse_lærer', {
        title: 'Tekstforståelse'
    });
});


router.post(encodeURI('/tekstforståelse'), function(req, res) {

    var initials;
    var teacherModules;

    var inputContent = [];
    var inputContentAnswers = [];
    var inputTexts = [];
    var inputQuestions = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    form.parse(req, function(err, fields, files) {

        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        teacherModules = data.teacherModules;

        var howManyQuestions = Object.keys(fields).filter(input => input.length > 12);
        var bigTemp = [];
        tempInputTexts = Object.keys(fields).filter(input => input.includes('txt'));

        var textObj = {
            texts: []
        };
        for (var i = 0; i < tempInputTexts.length; i++) {

            inputTexts.push({
                text: fields[tempInputTexts[i]]
            });
        }

        console.log('howManyQuestions: ' + howManyQuestions.length);
        for (var i = 0; i < howManyQuestions.length; i++) {

            var tempInputContent = Object.keys(fields).filter(input => input.includes(
                'q' + i
            ));

            bigTemp.push(tempInputContent);
        }
        for (i = 0; i < bigTemp.length; i++) {
            //            console.log("question" +i +": " + fields[bigTemp[i][0]]);
            // spørgsmålet skal komme her 
            var obj = {
                question: fields[bigTemp[i][0]],
                options: []
            };
            for (j = 0; j < bigTemp[i].length; j++) {

                if (bigTemp[i][j].length > 5 && bigTemp[i][j].length < 10) {

                    //                    console.log("Option" + j +": " + fields[bigTemp[i][j]]);
                    obj.options.push(fields[bigTemp[i][j]]);

                } else if (bigTemp[i][j].length > 10) {

                    var correct_index = fields['correct_for_q' + i];
                    var correct = fields['q' + i + ' opt' + correct_index];

                    inputContentAnswers.push({
                        index: "question " + i,
                        answer: correct
                    });
                }
            }
            inputQuestions.push(obj);

        }
        console.log("KIIIG HEEER111111: ", inputTexts);
        console.log("KIIIG HEEER222222: ", inputContentAnswers);
    });


    formHandler(req.url, form, inputTexts, inputContentAnswers, function(mod) {

        // find the correct teachers test 
        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                console.log("MODMODMODMODMOD ", mod);

                mod.content = {
                    texts: inputTexts,
                    questions: inputQuestions
                };

                // mod.content.push(inputQuestions); 
                // mod.inputQuestions = inputQuestions; 
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });
});




/* ALLE FUNKTIONER DER ER TILKNYTTET LETTER*/

router.get(encodeURI('/brev_lærer'), function(req, res) {
    res.render('brev_lærer', {
        title: 'Brev'
    });
});


router.post(encodeURI('/brev'), function(req, res) {

    var initials;
    var teacherModules;

    var inputContent = [{}];
    var inputContentAnswers = [{}];

    var form = new formidable.IncomingForm();

    // // parse the request and handle fields data
    form.parse(req, function(err, fields, files) {
        var data = JSON.parse(fields.data);
        delete fields.data;

        initials = data.username;
        teacherModules = data.teacherModules;
    });

    // handle all the files together with fields data
    // the output  - mod - is an object containing module data
    formHandler(req.url, form, inputContent, inputContentAnswers, function(mod) {

        // find the correct teachers test 
        teacherClass.findOneAndUpdate({
            initials: initials
        }, 'tests', function(err, teacher) {
            if (err) {
                res.send(err);
            } else {
                console.log("TEACHER: " + teacher);
                teacher.tests[teacher.tests.length - 1].modules.push(mod);

                teacher.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(teacherModules[0]);
                    teacherModules.shift();
                });
            }
        });
    });
});


/* NEXTPAGE ER EN DUMMY DER SENDER DIG VIDERE TIL KURSISTSIDEN*/

router.get('/nextpage', function(req, res) {
    res.render('nextpage', {
        title: 'Nextpage'
    });
});


router.post('/nextpage', function(req, res) {
    res.redirect(kursistModules[0]);
    kursistModules.shift();
    console.log('next module should be ' + kursistModules[0]);
});









/*      HER ER ALLE PARTICIPANT SIDERNE     */


/* ALLE FUNKTIONER DER ER TILKNYTTET STARTPAGE */

//henter hjemmesiden 'startpage' 

router.get(encodeURI('/startpage'), function(req, res) {
    res.render('startpage', {
        title: 'Startside'
    });
});

router.post(encodeURI('/startpage_addinfo'), function(req, res) {

    // var db = req.db;
    //    console.log(req.body);
    //    console.log("DOES THIS EXISt " + studentID);
    //    var firstname = req.body.firstname;
    //    var lastname = req.body.lastname;
    //    var age = req.body.age;
    //    var mothertong_dk = req.body.mothertong_dk;
    //    var tong_input = req.body.tong_input;
    //    var years_in_dk = req.body.years_in_dk;
    //    var edu_in_dk = req.body.edu_in_dk;
    //    var pass_test = req.body.pass_test;
    //    var eg_test = req.body.eg_test;
    //
    //
    //
    //    var speciel_edu = req.body.speciel_edu;
    //    var speciel_edu_adult = req.body.speciel_edu_adult;
    //    var eg_edu = req.body.eg_edu;
    //
    //    var years_in_edu = req.body.years_in_edu;
    //    var years_in_edu_home = req.body.years_in_edu_home;
    //    var exam_finish = req.body.exam_finish;
    //    var eg_exam = req.body.eg_exam;
    //    var eg_exam_country = req.body.eg_exam_country;
    //    var edu_finish = req.body.edu_finish;
    //    var eg_edu_finish = req.body.eg_edu_finish;
    //    var eg_edu_finish_country = req.body.eg_edu_finish_country;
    //    var read_write_con = req.body.read_write_con;
    //    var eg_con = req.body.eg_con;
    //
    //    var in_job = req.body.in_job;
    //    var eg_job = req.body.eg_job;
    //    var read_write_in_job = req.body.read_write_in_job;
    //    var eg_read_write_in_job = req.body.eg_read_write_in_job;
    //    var read_in_job = req.body.read_in_job;
    //    var write_in_job = req.body.write_in_job;
    //    var lang_in_job = req.body.lang_in_job;
    //
    //    var why_fvu = req.body.why_fvu;
    //
    //    var improvement = req.body.improvement;
    //    var eg_improvement = req.body.eg_improvement;
    //
    ////    var collection = db.get('students');
    //
    //    
    //   studentClass.find()({
    //        "studentID": studentID
    //    }, {
    //        $set: {
    //            //"id": initials,
    //            "Fornavn": firstname,
    //            "Efternavn": lastname,
    //            "Alder": age,
    //            "Har du andet end dansk som modersmål": mothertong_dk,
    //            "Hvad er dit modersmål": tong_input,
    //            "Hvor længe har du boet i Danmark": years_in_dk,
    //            "Har du fået undervisning i dansk": edu_in_dk,
    //            "Har du bestået nogen prøver": pass_test,
    //            "Evt hvilke(n)": eg_test,
    //            "Har du modtaget specialundervisningen i skolen": speciel_edu,
    //            "Har du modtaget specialundervisning som voksen": speciel_edu_adult,
    //            "Evt i hvilke(t) fag og hvor længe": eg_edu,
    //            "Hvor længe har du gået i skole": years_in_edu,
    //            "Hvor længe har du gået i skole i dit hjemland": years_in_edu_home,
    //            "Har du afsluttende eksamen fra din skole": exam_finish,
    //            "Evt i hvilke(n)": eg_exam,
    //            "Fra hvilket land": eg_exam_country,
    //            "Har du en uddannelse": edu_finish,
    //            "Evt hvilken": eg_edu_finish,
    //            "Evt fra hvilket land": eg_edu_finish_country,
    //            "Har dine læse- og stavevanskeligheder haft betydning for skole og uddannelse": read_write_con,
    //            "Evt på hvilken måde": eg_con,
    //            "Er du i job": in_job,
    //            "Evt hvilket": eg_job,
    //            "Indgår der læsning eller skrivning i dit job": read_write_in_job,
    //            "Evt hvordan": eg_read_write_in_job,
    //            "Hvordan klarer du at læse på jobbet": read_in_job,
    //            "Hvordan klarer du at skrive på jobbet": write_in_job,
    //            "Hvilket sprog taler du mest på dit job": lang_in_job,
    //            "Hvorfor vil du gerne gå til FVU-læsning": why_fvu,
    //            "Hvad vil du gerne blive bedre til": improvement,
    //            "Andet": eg_improvement,
    //            //"time": "12:00:00",
    //            "tests": []
    //        }
    //    }, function (err, doc) {
    //        if (err) {
    //
    //            res.send("There was a problem adding the information to the database.");
    //
    //        } else {

    console.log("######## student modules: " + kursistModules[0]);
    res.redirect(kursistModules[0]);
    kursistModules.shift();

    //        }
});
//});


//initials = 'tintin';
var g_moduleCount = 0;


router.get(encodeURI('/kursistinfo_kursist'), function(req, res) {



    teacherClass.find({


        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    var index = totalLen - currentLen;
                    var content = teacher[0].tests[i].modules[index].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    res.render('template', {
                        content: content,
                        'title': moduleType,
                        description: "Dette er en beskrivelse af testen",
                        descriptionAudio: null
                    });


                } else {
                    console.log("NO MATCH");
                }
            }
        }
    });
});

router.post(encodeURI('/kursistinfo_answer'), function(req, res) {


    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);



    //det første der sker, er at 'writeTo' mappen tømmes 
    folderHandler();

    // arrays that should hold data fields from the client form
    var inputAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data
    form.parse(req, function(err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        console.log("KKKUUURRRSSSIIISSSTTTT ", fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'kursistinfo',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });

});


/* ALLE FUNKTIONER DER ER TILKNYTTET WORDDICTATE */

//henter 'worddictate_participant' og finder data i databasen, svarende til de indtastede initialer
router.get(encodeURI('/orddiktat_kursist'), function(req, res) {

    // teacherID = JSON.stringify(teacherID); 
    // %%% Skal hentes fra sessionStorage
    console.log("TEACHER ID: " + typeof JSON.stringify(teacherID));


    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 


    teacherClass.find({


        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var audio_files = [];
                    var promises = [];
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    console.log("TOTAL LEN: " + totalLen + ", CURR LEN: " + currentLen);
                    var index = totalLen - currentLen;
                    var content = teacher[0].tests[i].modules[index].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[index].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[index].content.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[index].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function(result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: content,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
});



router.post(encodeURI('/orddiktat_answer'), function(req, res) {


    //update teacher test counter.
    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);


    //det første der sker, er at 'writeTo' mappen tømmes 
    folderHandler();

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    // 
    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function(err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Orddiktat',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    //					isThisLastModule(kursistModules);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET NONSENSE */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer
router.get(encodeURI('/vrøvleord_kursist'), function(req, res) {

    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    teacherClass.find({

        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var audio_files = [];
                    var promises = [];
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    console.log("TOTAL LEN: " + totalLen + ", CURR LEN: " + currentLen);
                    var index = totalLen - currentLen;
                    var content = teacher[0].tests[i].modules[index].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[index].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[index].content.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[index].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function(result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: content,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
});



router.post(encodeURI('/vrøvleord_answer'), function(req, res) {

    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);


    //det første der sker, er at 'writeTo' mappen tømmes 
    folderHandler();

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function(err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Vrølveord',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    //					isThisLastModule(kursistModules);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET CLOZETEST */

//henter clozetest_participant og finder data i databasen, svarende til de indtastede initialer

router.get(encodeURI('/clozetest_kursist'), function(req, res) {
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    teacherClass.find({


        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var audio_files = [];
                    var promises = [];
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    console.log("TOTAL LEN: " + totalLen + ", CURR LEN: " + currentLen);
                    var index = totalLen - currentLen;
                    var content = teacher[0].tests[i].modules[index].content; //0 = orddiktat
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[index].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[index].content.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[index].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function(result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: content,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
});


router.post(encodeURI('/clozetest_answer'), function(req, res) {

    //det første der sker, er at 'writeTo' mappen tømmes 


    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);


    folderHandler();

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function(err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Clozetest',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });
});



/* ALLE FUNKTIONER DER ER TILKNYTTET INTERPRET */

//henter clozetest_participant og finder data i databasen, svarende til de indtastede initialer
router.get(encodeURI('/tekstforståelse_kursist'), function(req, res) {
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 

    teacherClass.find({

        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var audio_files = [];
                    var promises = [];
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    console.log("TOTAL LEN: " + totalLen + ", CURR LEN: " + currentLen);
                    var index = totalLen - currentLen;
                    var content = teacher[0].tests[i].modules[index].content; //0 = orddiktat
                    var inputQuestions = teacher[0].tests[i].modules[index].inputQuestions;
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[index].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[index].content.texts.length; j++) {
                        promises.push(mongo.readFromDB('file' + j + '.mp3', teacher[0].tests[i].modules[index].content.texts[j].file.file_id));
                    }
                    Promise.all(promises).then(function(result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }
                        console.log(moduleType);
                        res.render('template', {
                            content: content,
                            // questions: inputQuestions, 
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen",
                            audioFiles: result
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }


        }
    });
});


router.post(encodeURI('/tekstforståelse_answer'), function(req, res) {
    //det første der sker, er at 'writeTo' mappen tømmes 

    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);


    folderHandler();

    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function(err, fields, files) {


        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }

        var mod = {
            moduleType: 'Tekstforståelse',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });
});

/* ALLE FUNKTIONER DER ER TILKNYTTET LETTER */

//henter 'output' og finder data i databasen, svarende til de indtastede initialer

router.get('/brev_kursist', function(req, res) {
    //lige nu henter den alle documenter med disse initialer, selvom den kun skal vise 1 (den første)
    //senere skal der tilføjes en hovedside hvor brugeren kan vælge hvilken test, på baggrund af sine initialer 
    teacherClass.find({

        // %%% Skal hentes fra sessionStorage
        "tests._id": teacherID


    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            var id_serv = JSON.stringify(teacherID);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_db == id_serv) {
                    var audio_files = [];
                    var promises = [];
                    var totalLen = teacher[0].tests[i].totalModules;
                    var currentLen = kursistModules.length;
                    console.log("TOTAL LEN: " + totalLen + ", CURR LEN: " + currentLen);
                    var index = totalLen - currentLen;
                    var moduleType = teacher[0].tests[i].modules[index].moduleType;

                    promises.push(mongo.readFromDB('descriptionAudio.mp3', teacher[0].tests[i].modules[index].audio.file_id));
                    for (var j = 0; j < teacher[0].tests[i].modules[index].content.length; j++) {
                        //i brevet er det en tekst fil der bliver hentet, ikke en lydfil
                        promises.push(mongo.readFromDB('file' + j + '.pdf', teacher[0].tests[i].modules[index].content[j].file.file_id));
                    }
                    Promise.all(promises).then(function(result) {

                        for (var k = 0; k < result.length; k++) {
                            result[k] = result[k].slice(2);
                        }

                        res.render('template', {
                            content: result,
                            'title': moduleType,
                            descriptionAudio: result.shift(),
                            description: "Dette er en beskrivelse af testen"
                        });

                    });
                } else {
                    console.log("NO MATCH");
                }
            }

        }
    });
});

router.post('/brev_answer', function(req, res) {

    //det første der sker, er at 'writeTo' mappen tømmes 
    // %%% Skal hentes fra sessionStorage
    HandleTestCounter(teacherID);


    folderHandler();

    console.log('test');
    // arrays that should hold data fields from the client form
    var inputAnswers = [];
    // var inputContentAnswers = [];

    var form = new formidable.IncomingForm();

    // parse the request and handle fields data

    form.parse(req, function(err, fields, files) {

        inputAnswers = [];
        var temp = Object.keys(fields);
        for (i = 0; i < temp.length; i++) {
            inputAnswers.push(fields[temp[i]]);
        }
        var mod = {
            moduleType: 'Brev',
            answers: inputAnswers
        }

        studentClass.findOneAndUpdate({

            // %%% Skal hentes fra sessionStorage
            studentID: studentID


        }, 'modules', function(err, student) {
            if (err) {
                res.send(err);
            } else {
                console.log("STUDENT: " + student);
                student.modules.push(mod);

                student.save(function(err) {
                    if (err) console.log(err);
                    res.redirect(kursistModules[0]);
                    kursistModules.shift();
                });
            }
        });
    });
});

router.get('/finalpage', function(req, res) {
    res.render('finalpage', {
        title: 'finalpage'
    });
});

router.get('/getStudentData', function(req, res) {
    var idTeacher = req.query.teacherID;
    var idStudent = req.query.studentID;
    console.log('TEACHER ID FROM CLIENT: ' + idTeacher);
    console.log('STUDENT ID FROM CLIENT: ' + idStudent);


    var student_data;

    studentClass.find({
        "teacherID": idTeacher,
        "studentID": idStudent
    }, function(err, students) {
        if (err) {
            console.log(err);
        } else {
            console.log("DATA FROM DB ABOUT STUDENTS: ", students);
            student_data = students;

            var final_score;

            teacherClass.find({
                "tests._id": idTeacher
            }, function(err, teacher) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DATA FROM DB ABOUT TEACHER: ", teacher);

                    var id_serv = JSON.stringify(idTeacher);

                    for (var i = 0; i < teacher[0].tests.length; i++) {
                        var id_db = JSON.stringify(teacher[0].tests[i]._id);

                        if (id_serv == id_db) {
                            console.log("1111 ", student_data[0]);
                            console.log("2222 ", teacher[0]);
                            final_score = evaluateScore(i, student_data[0], teacher[0]);
                            console.log("FINAL SCORE ", final_score);
                            res.send(JSON.stringify(final_score));
                        }
                    }

                }
            });
        }
    });
});

router.get('/getTestTypes', function(req, res) {
    var idTeacher = req.query.teacherID;

    teacherClass.find({
        "tests._id": idTeacher
    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {
            console.log("DATA FROM DB ABOUT TEACHER: ", teacher);
            var id_serv = JSON.stringify(idTeacher);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_serv == id_db) {
                    console.log("NYNYNYNYNYNY: " + teacher[0]);
                    for(var j=0; j<teacher[0].tests.length; j++) {
                        if(teacher[0].tests[j]._id == idTeacher) {
                            res.send(JSON.stringify(teacher[0].tests[j].modules)); 
                        }
                    } 
                }
            }
        }
    });
});


router.get('/getStudentScore', function(req, res) {
    var idTeacher = req.query.teacherID;
    var idStudent = req.query.studentID;

    studentClass.find({
        "teacherID": idTeacher
    }, function(err, students) {
        if (err) {
            console.log(err);
        } else {
            console.log("MARTS 2019 KIG HER - STUDENTS: ", students);
            res.send(JSON.stringify(students)); 
        }
    });
});


router.get('/getTeacherScore', function(req, res) {
    var idTeacher = req.query.teacherID; 

    teacherClass.find({
        "tests._id": idTeacher
    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {
            var id_serv = JSON.stringify(idTeacher);

            for (var i = 0; i < teacher[0].tests.length; i++) {
                var id_db = JSON.stringify(teacher[0].tests[i]._id);

                if (id_serv == id_db) {
                    
                    for(var j=0; j<teacher[0].tests.length; j++) {
                        if(teacher[0].tests[j]._id == idTeacher) {
                            res.send(JSON.stringify(teacher[0].tests[j].modules)); 
                        }
                    } 
                }
            }
        }
    });
});


// }).exec(function(err, user) {
//     if(err) console.log(err);
//     else {
//         console.log("DONE!"); 
//         res.send(JSON.stringify(final_score));
//     }
// var db = req.db;
// var collection = db.get('teachers');
// collection.findOne({
//     "initials": initials
// }, function (e, docs) {

//     console.log('Who am I? ', docs._id);
//     res.send(JSON.stringify(docs._id));
// });
// =======
// router.get('/getAllData', function (req, res) {
//     console.log('initials test: ' + initials);

//     teacherClass.find({
//         initials: initials
//     }, function (err, docs) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(docs);

//             res.send(JSON.stringify(docs[0].tests[docs[0].tests.length - 1]._id));
//         }
//     });


//     // var db = req.db;
//     // var collection = db.get('teachers');
//     // collection.findOne({
//     //     "initials": initials
//     // }, function (e, docs) {

//     //     console.log('Who am I? ', docs._id);
//     //     res.send(JSON.stringify(docs._id));
//     // });
// >>>>>>> 33cfb355fb1592a9ae19032db79ae65e2d217709


router.get('/tak', function(req, res) {
    res.render('tak', {
        title: 'Tak'
    });
});

router.post('/send_mail', function(req, res) {
    var testID;

    studentClass.findOne({

        // %%% Skal hentes fra sessionStorage
        'studentID': studentID


    }, function(err, student) {
        if (err) {
            console.log(err);
        } else {

            testID = student.teacherID;

            teacherClass.findOne({
                'tests._id': testID
            }, function(err, teacher) {
                if (err) {
                    console.log(err);
                } else {
                    //code to get correct answers
                    console.log("FINAL TEACHER ", teacher);

                    var id_serv = JSON.stringify(testID);

                    for (var i = 0; i < teacher.tests.length; i++) {
                        var id_db = JSON.stringify(teacher.tests[i]._id);

                        if (id_serv == id_db) {
                            var final_score = evaluateScore(i, student, teacher);
                            var mail = req.body.mail;
                            console.log("MAIL MAIL MAIL:::: ", final_score);
                            var msg = mailSender.htmlBuilder(final_score);
                            mailSender.sendMail(mail, msg);
                            res.redirect('tak');
                        }
                    }
                }
            });
        }
    });
});


function evaluateScore(testIndex, student, teacher) {
    var final_score = [];

    var teacher_id = teacher.initials;
    final_score.push(teacher_id);

    var student_id = student.studentID;
    final_score.push(student_id);


    for (var j = 0; j < student.modules.length; j++) {
        var module_score = {};
        var module_type = student.modules[j].moduleType;
        module_score.type = module_type;
        var module_answers = [];

        for (var k = 0; k < student.modules[j].answers.length; k++) {
            var point = 0;
            var student_answer = student.modules[j].answers[k];


            if (module_type.toLowerCase() == "kursistinfo") {
                var correct_answer = teacher.tests[testIndex].modules[j].content[k].input;
            } else {
                var correct_answer = teacher.tests[testIndex].modules[j].contentAnswer[k].answer;
            }



            if (correct_answer == null) {
                correct_answer = "Intet korrekt svar";
            } else if (student_answer == correct_answer) {
                point = 1;
            }
            module_answers.push({
                student_answer: student_answer,
                correct_answer: correct_answer,
                point: point
            });
        }
        module_score.answers = module_answers;
        final_score.push(module_score);
    }
    return final_score;
}


// TEEEEEEEEEEEEEEEEEEEEST FILE SYSTEM
router.get('/upload', function(req, res) {
    res.render('upload', {
        title: 'Filesystem'
    });
});

router.post('/upload', function(req, res) {

    var soundTrack;
    var db = req.db;
    var collection = db.get('upload');

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // stores the upload in local directory /view 
    form.uploadDir = path.join(__dirname, '../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        soundTrack = file;
        console.log('###########', JSON.stringify(file), '##########');
        fs.rename(file.path, path.join(form.uploadDir, "1"));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        // this is the callback, it can be populated with data eventually 
        var p = JSON.stringify(soundTrack);
        res.end(p);
        console.log('@@@@@@@@@@@', soundTrack, '@@@@@@@');
        console.log('this is p: ' + p);
        console.log('STRRRRIIIIIIING', JSON.stringify(soundTrack));
        collection.insert({
            "audio": p
        }, function(err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
        });
    });

    // parse the incoming request containing the form data
    form.parse(req);
});


//
//router.get('/template', function (req, res) {
//    res.render('template', {
//        title: 'Template'
//    });
//});

function formHandler(url, incForm, inputCont, inputContAns, callback) {

    var files = [];

    incForm.on('error', function(err) {
        console.log("ERROR ", err);
    });

    incForm.on('fileBegin', function(name, file) {
        console.log("1");
        //check if there is audio file
        if (file.name != '') {
            file.path = 'public/readFrom/' + file.name;
        }
    });

    incForm.on('file', function(name, file) {
        files.push([file]);
    });

    incForm.on('end', function() {
        console.log("3");
        console.log('FILES FILES FIES ', files[0][0].name);
        //this is where the fun begins 

        var promises = [];
        for (var i = 0; i < files.length; i++) {
            promises.push(
                new Promise(function(resolve, reject) {
                    // files.map(function (item) {

                    var fileUpload = files[i][0].name;
                    console.log("4 " + fileUpload);

                    var mongo = require('../public/js/mongoHandler');
                    //when MongoHandler is done with upload to MongoDB return result
                    //check if there is audiofile
                    if (fileUpload != '') {
                        console.log("NOT EMPTY FILE");
                        return mongo.writeToDB(fileUpload, fileUpload)
                            .then(function(result) {
                                console.log("FILEUPLOAD " + i + " FINISHED ", result);
                                // file_data[i] = result;
                                resolve(result);
                            }, function(err) {
                                console.log(err);
                            });
                    } else {
                        console.log("EMPTY FGILEEEE");
                    }
                })
            );
        }


        //once all the promises are done
        Promise.all(promises).then(function(file_data) {

            //when files are uploaded, they are removed from 'readFrom' folder
            empty('./public/readfrom', true, function(err, removed, failed) {
                if (err) {
                    console.error(err);
                }
                var dir = './public/readFrom';

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                fs.writeFile('./public/readFrom/.gitignore', '', (err) => {
                    if (err) throw err;

                    console.log("The file was succesfully saved!");
                });
            });



            //this is the content from the teacher test
            //this should be saved in mongoDB 'teachers' collection 
            for (var i = 1; i < file_data.length; i++) {
                console.log("FILES FILES FILES ", file_data);
                inputCont[i - 1].file = file_data[i];
            }

            var mod = {
                moduleType: decodeURI(url).slice(1),
                audio: file_data[0],
                content: inputCont,
                contentAnswer: inputContAns
            };

            console.log("MODULE: ", mod);



            return callback(mod);

        });
    });
};


//function ThisShouldAlsoBeAFuntction(){
//	var isThisLastModule = kursistModules.length === 1;
//	if(isThisLastModule){
//		console.log('this is the last module, now we update the test counter');
//	}
//};


function folderHandler() {
    empty('./public/writeTo', true, function(err, removed, failed) {
        if (err) {
            console.error(err);
        }
        var dir = './public/writeTo';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile('./public/writeTo/.gitignore', '', (err) => {
            if (err) throw err;

            console.log("The file was succesfully saved!");
        });
    });

}


function HandleTestCounter(testId) {
    console.log(testId);
    var isThisLastModule = kursistModules.length === 1;
    if (isThisLastModule) {
        console.log('this is the last module, now we update the test counter');

        teacherClass.findOneAndUpdate({
                "tests._id": testId
            }, {},
            function(err, teacher) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('se her>>> ' + teacher.initials + ' ' + teacher.tests.length);
                    for (i = 0; i < teacher.tests.length; i++) {
                        if (JSON.stringify(testId) == JSON.stringify(teacher.tests[i]._id)) {
                            console.log('test count before: ' +
                                teacher.tests[i].totalTestTaken
                            );

                            teacher.tests[i].totalTestTaken++;

                            console.log('new test count after: ' +
                                teacher.tests[i].totalTestTaken
                            );
                        }
                    }
                    teacher.save();
                }
            });
    }
};

router.post('/addUser', function(req, res) {
    console.log('first retrieve initials');
    var initials = req.body.createUser.trim().toUpperCase();
    console.log('second create new teacher entry');
    teacherClass.findOne({
        initials: initials
    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            if (!teacher) {
                console.log("NEW TEACHER");
                //opret en ny
                teacher = new teacherClass({
                    initials: initials,
                    totalTests: 0,
                    tests: []
                });
                teacher.save(function(err, test) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/start');
                    }
                });
            }
        }
    });

    console.log('third get initials and password after');
    console.log('finally send mail with info to mmr');
    //	res.redirect('/start');

});
router.post('/sendUser', function(req, res) {
    console.log('third get initials and password after');
    var init = req.body.sendUser.trim().toUpperCase();
    var psw;
    teacherClass.findOne({
        initials: init
    }, function(err, teacher) {
        if (err) {
            console.log(err);
        } else {

            if (!teacher) {
                res.redirect('/start');
            } else {
                init = teacher.initials;
                psw = teacher.password;
                console.log('finally send mail with info to mmr');
                console.log(init + ' ' + psw);
                var msg = 'brugernavn: ' + init + '\r' + ', adgangskode: ' + psw;
                mailSender.sendMail('mmr@vucfyn.dk', msg);
                res.redirect('tak');
            }


        }
    });
});


module.exports = router;