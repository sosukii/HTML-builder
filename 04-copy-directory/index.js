const path = require('path')
const {readdir} = require('node:fs/promises')
const {copyFile, promises, mkdir} = require('fs')

const donorFolderPath = path.join(__dirname, 'files')
const newFolderPath = path.join(__dirname, 'files-copy')

async function makeDirIfNotExist(dirPath){
  try{
    await promises.access(dirPath)
  } catch(e){
    mkdir(dirPath, (err, result) => {
      if(err){
        console.error(err)
      }
    })
  }
}

async function copyDir(){
  try {
    const files = await readdir(donorFolderPath);

    makeDirIfNotExist(newFolderPath)

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