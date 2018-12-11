const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < files.length; i++) {
        var id = files[i].split('.')[0];
        data.push({id: id, text: id});
      }
      callback(null, data); 
    }
  });

};

exports.readOne = (id, callback) => {
  // fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     callback(null, JSON.parse(fileData));
  //   }
  // });

  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, {
      id,
      text
    });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {
      id,
      text
    });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
