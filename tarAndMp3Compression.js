// 1. 遍历目标文件夹下面所有文件和文件夹
// 2. 如果文件名字中包含有Q, 例如Q001.mp3 则删除字符串Q
// 3. 把所有音乐文件压缩后，保持原目录不变，放到一个新得"压缩后"文件夹中
// 4. 对压缩后得文件夹进行tar打包, 生成MD5命令, 创建txt文档


const fs = require('fs');
const tar = require('tar');
let path = require('path');
const crypto = require('crypto');
const child_process = require('child_process');
const dir = __dirname;
const lame = path.join(dir, 'lame/lame.exe');
const afterCompressionDirName = "1压缩后的音乐文件";

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

/*
  以当前文件所在位置为根节点，读取所有子目录下的文件，并以子目录名压缩成tar格式
  @param {String} TargetPath 是需要读取文件目录的绝对路径
  */
function readDirectory(TargetPath) {
  let files = fs.readdirSync(TargetPath); // 同步读取目录下的所有文件和文件夹，只会读取第一层.
  let packName, filePath, TargetFiles, textContent, tarFilePath;
  files.forEach((file, index) => {
    let fillPath = TargetPath + "/" + file;
    let fileStatus = fs.statSync(fillPath);//获取一个文件的属性

    // 不遍历准备输出的两个文件夹
    if (fileStatus.isDirectory() && (file !== afterCompressionDirName)) {
      packName = file; // 获取包名变量
      filePath = path.join(TargetPath, file); // 获取当前文件夹名的绝对路径
      tarFilePath = "./" + file + ".tar.gz"; // tar.gz 格式的文件路径
      TargetFiles = fs.readdirSync(filePath);
      handleMusic(TargetPath, file);

      // 4. 生成MD5命令, 创建txt文档
      textContent = content(file, index, calcMd5(tarFilePath));
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
      sync: true,
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


/**
 *
 *
 * @param str 需要处理的字符串
 * @param mode , "remove" or "add"
 * @return string 
 */
function handleQ(str, mode) {
  switch (mode) {
    case "remove":
      return str.replace("Q", "");
    case "add":
      return "Q" + str;
  }
}

/**
 *
  这个函数可以在指定的目录下创建2个文件夹，返回对象是两个文件夹的绝对路径
 * @param path 需要在哪里创建文件夹的路径
 * @return {*} 
 */
function createOutputDir(TargetPath) {
  let afterCompressionDir = path.join(TargetPath, afterCompressionDirName);
  if(!fs.existsSync(afterCompressionDir)) {
    afterCompressionDir = fs.mkdirSync(afterCompressionDir, { recursive: true });
  }
  return afterCompressionDir
}

/**
 *
 * 同步创建文件夹
 * @param absolutePath
 */
function createDir(absolutePath) {
  if(!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath);
  }
}

/**
 *
 *
 * @param musicDir 包含音乐的文件夹绝对路径
 * @param dirName 包含音乐的文件夹名字
 */
function handleMusic(inputDir, waitProcessDirName) {
  // console.log("inputDir", inputDir);
  console.log("musicDirName", waitProcessDirName);
  let absoluteMusicDir = path.join(inputDir,waitProcessDirName);
  let absoluteCompressionMusicDir = path.join(inputDir, afterCompressionDirName, waitProcessDirName);
  // 在压缩后创建对应得子文件夹
  createDir(absoluteCompressionMusicDir);

  // 遍历子文件夹，里面都是单个音乐MP3文件
  fs.readdirSync(absoluteMusicDir).map(async music => {
    let absoluteMusicPath = path.join(absoluteMusicDir, music);
    let fileStatus = fs.statSync(absoluteMusicPath);
    if(fileStatus.isDirectory()) {
      return;
    }
    // 1. 把音乐文件改名，生成新的压缩后得音乐文件绝对路径
    let newMusicFile = handleQ(music, "remove");
    let newMusicPath = path.join(absoluteCompressionMusicDir, newMusicFile);

    // 2. 把所有音乐文件压缩后放到一个新得"压缩后"文件夹中
    await compressMp3(absoluteMusicPath, newMusicPath);
  })

  // 3. 把压缩后得音乐文件夹压缩成tar格式
  let compressMusicFiles = fs.readdirSync(absoluteCompressionMusicDir);
  createTar(waitProcessDirName, compressMusicFiles, absoluteCompressionMusicDir);


}

async function compressMp3(currentPath, targetPath) {
  // url 必须是绝对路径，
  // 第一个url 是压缩前得，
  // 第二个url 是压缩后得,
  // 两个URL 必须不是一样得。

  let cmd = `${lame} -V 0 -q 0 -b 45 -B 80 --abr 64 "${currentPath}" "${targetPath}"`;
  await child_process.execPromise(cmd).then((stdout, stderr) => {
      console.log("done")
  }).catch((err) => {
    console.log(err);
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
    // console.log(`你需要处理的文件夹根目录是：${input}`);
    readline.close();

    // 创建压缩后得输出文件夹
    createOutputDir(input); 

    // 读取指定得目录
    readDirectory(input);
  })
}

__main();