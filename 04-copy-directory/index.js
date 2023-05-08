const path = require('path')
const {readdir} = require('node:fs/promises')
const {copyFile, mkdir, promises} = require('fs')

const donorFolderPath = path.join(__dirname, 'files')
const newFolderPath = path.join(__dirname, 'files-copy')

async function copyDir(){
  try {
    const files = await readdir(donorFolderPath);

    mkdir(newFolderPath, {recursive: true}, err => {
      if(err){
        console.error(err)
      }
      console.log('создаем папку - успешно')
    })

    const filesNew = await readdir(newFolderPath);
    for(const newFile of filesNew){
      await promises.rm(path.join(__dirname, 'files-copy', newFile))

    }

    for (const file of files){
      const pathToDonorFile = path.join(donorFolderPath, file)
      const pathToNewFile = path.join(newFolderPath, file)

      try{
        copyFile(pathToDonorFile, pathToNewFile, (err, dest) => {
          if(err){
            console.error('Error at copyFile func: ', err)
          }
        })
      } catch(e){
        console.error(e)
      }
    }
  } catch(e){
    console.error('Error at copyDir func: ', e)
  }
}

copyDir()