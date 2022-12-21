const fs = require('fs');

function content(packName, index, md5) {
  return (
    `语音包名称：${packName}\n语音包自定义ID：${index}\n语音包描述(md5)：${md5}\r\n\n`
  )
}

let c = content("中文女生", 0, "1231q321adasd");

const data = fs.writeFileSync('./1.txt', c, { flag: 'a+'}, err => {
  if (err) {
    console.error(err);
    return;
  }
});