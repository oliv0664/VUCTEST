var path = require('path');
var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/vucfyntest';
//var mongoDB = 'mongodb://vucfyntest:test@ds237475.mlab.com:37475/vucfyntestdb';



var Grid = require('gridfs-stream');
var fs = require('fs');
 

var options = {
    useMongoClient: true
};
mongoose.connect(mongoDB, options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('connected', function(){console.log('connected correctly to db.');  });

Grid.mongo = mongoose.mongo;

// module.exports = { db: db, grid: Grid}

module.exports = {

    writeToDB: function(nameInFolder, nameInDB) {
        console.log("WRITE TO DB 1"); 
        return new Promise(function(resolve, reject) {
            console.log("WRITE TO DB 2"); 
        // db.once('open', function () {
            console.log('- Connection Open -');
            var gfs = Grid(db.db);
            
            var filePath = path.join(__dirname, '../readFrom/' + nameInFolder);
            
            var writestream = gfs.createWriteStream({
                filename: nameInDB
            });
            
            fs.createReadStream(filePath).pipe(writestream);
            
            var file_data; 
            writestream.on('close', function (file) {
                console.log("#####"); 
                console.log(file.filename + ' Written to DB');
                file_data = {
                    file_name: file.filename,
                    file_id: file._id
                }; 

                resolve(file_data); 
            });
        // });

        // reject(new Error('db conn fail')); 
        });
    },

    readFromDB: function(nameInFolder, IdInDb) {
        console.log("### READ FROM DB"); 
        return new Promise(function(resolve, reject){
            
            var destination = '../writeTo/' + nameInFolder;
            // resolve(destination);
    //        db.once('open', function () {
            console.log('- Connection Open -');
            var gfs = Grid(db.db);

            var fs_write_stream = fs.createWriteStream(path.join(__dirname, destination));

            var readstream = gfs.createReadStream({
                _id: IdInDb
            });

            readstream.pipe(fs_write_stream);

            fs_write_stream.on('close', function () {
                console.log('File has been written fully!');
                // var test = "HELLO WORLD"; 
                resolve(destination); 
                // return destination; 
            });
    //        });
        });
    }
}
//saves file to db, from folder called "readFrom"



//retrieves file from db, to folder called "writeTo"
// ****** REMEMBER! .mp4 extension on the filenames!! ********


// @param (file name from the folder, filename to be called in the db)
// remember .mp4 file extension!
// writeToDB('test.mp3', 'new_audio.mp3'); 


// @param (file name to be called in folder, filename in the db)
// remember .mp4 file extension!
// readFromDB('video_yourname.mp4', 'new_video.mp4'); 
