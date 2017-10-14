var db = require('../src/db');
var fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

var sql = '';
readFiles('./db/migrations/', function(filename, content) {
    console.log(filename);
    sql = sql + content;
}, function(err) {
  throw err;
});

setTimeout(function(){ // giving two seconds for the files to be read

    db.query(sql).then(function(result){
        console.log('Migrations applied successfully!');
    }).catch(function(error){
        console.log('Something wrong'+error);
        process.exit();
    });

}, 2000);

var sqlF = '';
readFiles('./db/functions/', function(filename, content) {
    console.log(filename);
    sqlF = sqlF + content;
}, function(err) {
  throw err;
});

setTimeout(function(){ // giving two seconds for the files to be read

    db.query(sqlF).then(function(result){
        console.log('Functions updated successfully!');
        process.exit();
    }).catch(function(error){
        console.log('Something wrong'+error);
        process.exit();
    });

}, 2000)