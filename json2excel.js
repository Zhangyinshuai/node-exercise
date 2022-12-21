const fs = require('fs'); // 需要安装node环境
const json2xls = require('json2xls') // 需要npm install json2xls
fs.readFile('./g20Tanstain.json', 'UTF8', function (err, data) { // 获取中文配置文件的JOSN数据
  if (err) throw err;
  let A = JSON.parse(data);
  let jsonArray = []
  for (let i in A) {
    jsonArray.push({
      index: i,
      '中文': A[i]
    })
  }

  let xlxsData = json2xls(jsonArray);
  fs.writeFileSync('./data.xlsx', xlxsData, 'binary')
})