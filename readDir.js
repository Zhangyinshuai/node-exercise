var fs = require('fs');

console.log("查看 nodejs 小书目录");
fs.readdir("./nodejs小书/webService/", (err, files)=> {
  if (err) {
    return console.error(err);
  }
  console.log("files", files);
  files.forEach( function(file) {
    console.log( file );
  })
})