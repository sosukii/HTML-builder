const fs = require('fs')
const path = require('path')
const {readdir} = require('node:fs/promises')

const pathToFolder = path.join(__dirname, 'secret-folder')

async function getInfo(){
  try {
    const files = await readdir(pathToFolder, {withFileTypes: true});

    for (const file of files){
      if (file.isFile()){
        const pathToFile = path.join(pathToFolder, file.name)

        const name = file.name.split('.')[0]
        const type = file.name.split('.')[1]

        fs.stat(pathToFile, (err, stats) => {
          if(err){
            console.error(error)
          } else{
            const size = stats.size
            console.log(`${name} - ${type} - ${size}b`);
          }
        })
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getInfo()