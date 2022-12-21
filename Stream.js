var fs = require('fs');
var data = "";

var readerStream = fs.createReadStream("./批处理文件输出txt/input.txt");

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
  data += chunk;
});

readerStream.on('end',function(){
  console.log(data);
});

readerStream.on('error', function(err){
  console.log(err.stack);
});

console.log("读取程序执行完毕");
console.log("写入程序执行开始");


// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('./批处理文件输出txt/input.txt');

// 使用 utf8 编码写入数据
writerStream.write("123456",'UTF8');

// 标记文件末尾
writerStream.end();