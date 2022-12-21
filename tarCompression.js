const fs = require('fs');
const tar = require('tar');
let path = require('path');
const crypto = require('crypto');

/*
  以当前文件所在位置为根节点，读取所有子目录下的文件，并以子目录名压缩成tar格式
  @param {String} TargetPath 是需要读取文件目录的绝对路径
  */
function readDirectory(TargetPath) {
  // var currPath = __dirname;//文件的绝对路径 当前当前js所在的绝对路径
  let files = fs.readdirSync(TargetPath); // 同步读取目录下的所有文件和文件夹，只会读取第一层.
  let packName, filePath, TargetFiles, md5, textContent;
  files.forEach((file, index) => {
    let fillPath = TargetPath + "/" + file;
    let fileStatus = fs.statSync(fillPath);//获取一个文件的属性
    if (fileStatus.isDirectory()) {
      packName = file;
      filePath = path.join(TargetPath, file);
      tarFilePath = "./" + file + ".tar.gz";
      // console.log("tarFilePath=", tarFilePath);
      // console.log("当前的文件路径", filePath);
      TargetFiles = fs.readdirSync(filePath);
      // 对文件夹内所有文件进行压缩
      createTar(packName, TargetFiles, filePath);
      // // 在回调函数中创建文件,

      console.log("创建完成，当前创建的文件tar名字是:", packName);
      md5 = calcMd5(tarFilePath);
      textContent = content(file, index, md5);
      writeTxt(textContent);
    }
  })
}

/**
 * 执行压缩操作
 * @param {String} packName  打包后的包名
 * @param {Array} files  需要打包的所有文件
 * @param {String} filePath  需要忽略的路径，不加这个参数会把文件夹也压缩进去
 * @param {function} 压缩完成后的回调函数
 }}
 */

function createTar(packName, files, filePath) {
  let fileName = packName + '.tar.gz';
  tar.c(
    {
      gzip: true,
      file: fileName,
      cwd: filePath,
      // sync: true,
    },
    files
  )
}

/*
  @param {String} 文件的绝对路径
  传入文件，返回计算文件的MD5值
*/
function calcMd5(tar) {
  const buffer = fs.readFileSync(tar);
  const hash = crypto.createHash('md5');
  hash.update(buffer, 'utf8');
  const md5 = hash.digest('hex');
  return md5;
}

/**
 * 拼接需要输出的内容
 */
function content(packName, index, md5) {
  return (
    `语音包名称：${packName}\n语音包自定义ID：${index}\n语音包描述(md5)：${md5}\r\n\n`
  )
}

/**
 * @param {string} content 需要写入的内容, 采用追加写入的方式
 * 
 */
function writeTxt(content) {
  const data = fs.writeFileSync('./相关信息.txt', content, { flag: 'a+' }, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}


function __main() {
  // 读取用户的输入
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let currentPath = new Promise(resolve => {
    readline.question("请复制语言包所在的根路径，即所有文件夹的上一层文件夹: ", resolve);
  })

  currentPath.then((input) => {
    console.log(`你需要处理的文件夹根目录是：${input}`);
    readline.close();
    readDirectory(input);
  })
}

__main();