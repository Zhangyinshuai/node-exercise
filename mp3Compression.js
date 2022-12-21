// 压缩mp3

var fs = require('fs');
let path = require('path');
const child_process = require('child_process');
var targetPath = './music'; // 目录
const dir = __dirname;
const lame = path.join(dir, 'lame/lame.exe');

  // 同步执行exec
  child_process.execPromise = (cmd, options, callback) => {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, options, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve();
        })
    });
};

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

async function compressMp3(currentPath, targetPath) {
      // url 必须是绝对路径，
      // 第一个url 是压缩前得，
      // 第二个url 是压缩后得,
      // 两个URL 必须不是一样得。

      let cmd = `${lame} -V 0 -q 0 -b 45 -B 80 --abr 64 "${currentPath}" "${targetPath}"`;
      await child_process.execPromise(cmd).then(() => {
          // this.moveFile(targetPath, currentPath);
          console.log("done")
      }).catch((err) => {
        console.log(err);
      });
}


function __main () {
  // console.log(__dirname);
  compressMp3("D:/zy/Node.js/music/葡萄牙语0916/Q004.mp3", "D:/zy/Node.js/music/压缩后的音乐文件/葡萄牙语0916/Q004.mp3")
}

__main();

