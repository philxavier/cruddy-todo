const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var readFileAsync = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, count) => {
    if (err) {
      console.log(err);
    } else {
      items.text = text;
      items.id = count;
      fs.writeFile(path.join(exports.dataDir, `${count}.txt`), text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, items);
        }
      });
    }
  });

};


exports.readAll = (callback) => {

  var data = [];
  var ids = [];
  
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < files.length; i++) {
        ids.push(files[i].split('.')[0]);
        var filePath = path.join(exports.dataDir, files[i]);
        data.push(readFileAsync(filePath));
      }
      Promise.all(data).then(() => {
        var todos = [];
        for (var i = 0; i < data.length; i++) {
          todos.push({id: ids[i], text: data[i]});
        }
        callback(null, todos);
      });
    }
  });

};

//var readFile = Promise.promisify(require("fs").readFile);
// var files = [];
// for (var i = 0; i < 100; ++i) {
//   files.push(fs.writeFileAsync('file-' + i + '.txt', '', 'utf-8'));
// }
// Promise.all(files).then(function () {
//   console.log('all the files were created');
// });

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      console.log(err);
      callback(err, {});
    } else {
      var todo = {
        id: id,
        text: fileData.toString()
      };
      callback(null, todo);
    }
  });

};

exports.update = (id, text, callback) => {

  if (fs.existsSync(path.join(exports.dataDir, `${id}.txt`))) {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        console.log(err);
        callback(err, {});
      } else {
        callback(null, {
          id: id,
          text: text
        });
      }
    });
  } else {
    callback('dog', {});
  }

};


exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      //console.log(`${id}.txt was deleted`);
      callback(null);
    }
  });
};

// "Complete deleting a todo"
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
