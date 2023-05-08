const path = require('path')
const {readdir} = require('node:fs/promises')
const {appendFile, readFile} = require('fs')

const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css')
const pathToStyles = path.join(__dirname, 'styles')

async function merge(){
  appendFile(bundleFilePath, '', err => {
    if(err){
      console.error(err)
    }
    console.log('success create file');
  })

  const files = await readdir(pathToStyles);

  for(const file of files){
    if(file.split('.')[1] === 'css'){
      const pathToDonorFile = path.join(__dirname, 'styles', file)
      readFile(pathToDonorFile, 'utf8', (err, data) => {
        if(err){
          console.log(err);
        }

        appendFile(bundleFilePath, data, err => {
          if(err){
            console.error(err)
          }
          console.log('success appending ' + file);
        })
      })
    }
  }
}
merge()