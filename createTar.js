const fs = require('fs');
const tar = require('tar');

tar.c(
  {
    gzip: true,
    file: 'my-tarball.tgz'
  },
  ['./米家G2需要的翻译.xlsx', './1.txt']
).then(()=> {console.log("压缩完成咯")});