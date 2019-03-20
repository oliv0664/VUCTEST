var mongoose = require('mongoose');
var generator = require('generate-password');



var Schema = mongoose.Schema;


//
var moduleSchema = new Schema({
	moduleType: String,
	audio: String,
	content: {
		type: Array,
		default: []
	},
	contentAnswers: {
		type: Array,
		default: []
	}
});
//
//var moduleClass = mongoose.model('modules', moduleSchema); 



var teacherSchema = new Schema({
	initials: String,
	password: { type: String,
			   default: function(){
				   return generator.generate({
					   length: 14,
					   numbers: true,
					   uppercase: true
				   });
			   }
	},
	totalTests: Number,
	tests: [{
		date: Date,
		totalModules: Number,
		totalTestTaken: {
			type: Number,
			default: 0
		},
		modules: {
			type: Array,
			default: []
		}
	}]
}, {usePushEach: true});



var teacherClass = mongoose.model('teachers', teacherSchema);
// var moduleClass = mongoose.model('teachers', moduleSchema); 

module.exports = teacherClass;