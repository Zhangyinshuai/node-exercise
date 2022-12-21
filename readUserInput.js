const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// readline.question(`请复制语言包所在的根路径，即所有文件夹的上一层文件夹`, path => {
//   console.log(`你好 ${path}!`)
//   readline.close()
// })

const answer =  new Promise(resolve => {
  readline.question("What is your name? ", resolve)
})
console.log(answer.then((re)=> { console.log(re); readline.close();}))