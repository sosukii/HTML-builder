const fs = require('fs')
const path = require('path')
const {stdin, stdout} = process

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'))
stdout.write('Hello there!~ Enter some text below:\n')

stdin.on('data', value => {
  if(value.toString().trim() === 'exit'){
    process.exit()
  }
  writeStream.write(value.toString())
})

process.on('SIGINT', () => process.exit())