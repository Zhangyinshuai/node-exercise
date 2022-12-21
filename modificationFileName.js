var fs = require('fs');
let path = require('path');

var targetPath = './music/已转格式'; // 目录

// 遍历目录下(包括子目录)的所有文件
function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
    var filePath = currentDirPath;
    var fileName = dirent.name;
    var absoluteFilePath = path.join(currentDirPath, dirent.name);
    console.log("fileName: " +  fileName);
    if (dirent.isFile()) {
      // 如果是文件的话，就不用往下遍历了
      callback(absoluteFilePath, filePath, fileName);
    } else if (dirent.isDirectory()) {
      // 如果是文件夹，则再次递归调用。
      walkSync(absoluteFilePath, callback);
    }
  });
}


// 修改文件名称
function rename(oldPath, newPath) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      throw err;
    }
  });
}

walkSync(targetPath, function (absoluteFilePath, path, fileName) {
  console.log("path: " + path);
  console.log("fileName: " + fileName);
  console.log("absoluteFilePath: " + absoluteFilePath);
  let oldPath = absoluteFilePath;
  let newFileName = "Q" + fileName;
  let newPath = path + "/" + newFileName;
  rename(oldPath, newPath);
})