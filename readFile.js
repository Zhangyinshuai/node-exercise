var fs = require('fs');

// 异步读取
fs.readFile('input.txt', function(err, data) {
  if (err) {
    return console.error(err);
  }
  console.log('异步读取' + data.toString());
})
