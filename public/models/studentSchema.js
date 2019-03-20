var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var studentSchema = new Schema({
    
	studentID: String, 
    teacherID: String,
    studentInfo: { type: Object, default: {}},
    modules: [{
        moduleType: String,
        answers: { type: Array, default: [] }
    }]
   
},{usePushEach: true}); 



var studentClass = mongoose.model('students', studentSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = studentClass;

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