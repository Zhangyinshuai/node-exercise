// 把目录中的文件进行Zip压缩
let fs = require('fs');
let path = require('path');
let JSZIP = require("jszip");
let zip = new JSZIP();


// 读取目录以及文件
function readDir(obj, nowPath) {
  let files = fs.readdirSync(nowPath);
  files.forEach(function (fileName, index) {
    // 遍历检测目录中的文件
    console.log(fileName, index);
    let fillPath = nowPath + '/' + fileName;
    let file = fs.statSync(fillPath); // 获取文件的属性
    if (file.isDirectory()) {
      // 如果是目录的话，继续查询
      let dirList = zip.folder(fileName); //压缩对象中生成该目录
      readDir(dirList, fillPath); // 调用自身函数并重新检索目录文件
    } else {
      obj.file(fileName, fs.readFileSync(fillPath)); // 压缩目录添加文件
    }
  });
}

//开始压缩文件
function startZIP() {
  var currPath = __dirname;//文件的绝对路径 当前当前js所在的绝对路径
  var targetDir = path.join(currPath, "JsonMerge");

  readDir(zip, targetDir);
  zip.generateAsync({
    //设置压缩格式，开始打包
    type: "nodebuffer",//nodejs用
    compression: "DEFLATE",//压缩算法
    compressionOptions: {
      //压缩级别
      level: 9
    }
  }).then(function (content) {
    fs.writeFileSync(currPath + "/result.zip", content, "utf-8");//将打包的内容写入 当前目录下的 result.zip中
  });
}

startZIP();