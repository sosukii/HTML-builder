// todo
// создать папку project-dist - DONE
// создать ФАЙЛ projects-dist\index.html - DONE
// создать ФАЙЛ projects-dist\style.css - DONE

// скопировать assets в project-dist - DONE
// скопировать содержимое tamplate.html в projects-dist\index.html - DONE

// папка styles. скопировать всё из css файлов в project-dist\style.css - DONE
// считать содержимое папки components,
// в цикле аппендить на место одноименного компонента - код из одноименного файла хтмл  - DONE

const path = require('path')
const {readdir, readFile, writeFile} = require('node:fs/promises')
const {appendFile, mkdir, copyFile, promises} = require('fs')

const pathToDist = path.join(__dirname, 'project-dist')
const pathToDistHtml = path.join(__dirname, 'project-dist', 'index.html')
const pathToDistCss = path.join(__dirname, 'project-dist', 'style.css')
const pathToDonorAssets = path.join(__dirname, 'assets')
const pathToDistAssets = path.join(__dirname, 'project-dist', 'assets')
const pathToTemplate = path.join(__dirname, 'template.html')
const pathToDonorStyles = path.join(__dirname, 'styles')
const pathToComponents = path.join(__dirname, 'components')

function createFolder(pathtoFolder){
  mkdir(pathtoFolder, {recursive: true}, err => {
    if(err){
      console.error(err)
    }
    console.log('создаем папку - успешно')
  })
}
function createFile(pathToFile){
  appendFile(pathToFile, '', err => {
    if(err){
      console.error(err)
    }
    console.log('success create file');
  })
}
function copyFileFromPath(pathFrom, pathTo){
  copyFile(pathFrom, pathTo, err => {
    if(err) {
      console.error(err)
    }
  })
}
async function addBaseTemplate(){
  const data = await readFile(pathToTemplate, 'utf8')
  await writeFile(pathToDistHtml, data.toString())
}
async function copyItemFromPath(pathFrom, pathTo){
  const currentItem = await promises.stat(pathFrom)

  if(currentItem.isDirectory()) {
    createFolder(pathTo)
    const folderContent = await readdir(pathFrom)

    for(const item of folderContent){
      copyFileFromPath(path.join(pathFrom, item), path.join(pathTo, item))
    }
  }
}
async function createCssBundle(pathToStylesDonor, pathToStyleDist){
  const files = await readdir(pathToStylesDonor);

  for(const file of files){
    if(file.split('.')[1] === 'css'){
      const pathToDonorFile = path.join(__dirname, 'styles', file)
      readFile(pathToDonorFile, 'utf8', (err, data) => {
        if(err){
          console.log(err);
        }

        appendFile(pathToStyleDist, data, err => {
          if(err){
            console.error(err)
          }
          console.log('success appending ' + file);
        })
      })
    }
  }
}

async function build(){
  createFolder(pathToDist)
  createFolder(pathToDistAssets)
  createFile(pathToDistHtml)
  createFile(pathToDistCss)

  addBaseTemplate()
  createCssBundle(pathToDonorStyles, pathToDistCss)

  const assetsFiles = await readdir(pathToDonorAssets)

  for(const file of assetsFiles){
    const pathToDonorFile = path.join(pathToDonorAssets, file)
    const pathToTargetFile = path.join(pathToDistAssets, file)

    copyItemFromPath(pathToDonorFile, pathToTargetFile)
  }

  const componentsFiles = await readdir(pathToComponents)

  for(const componentFile of componentsFiles) {
    const nameOfCurrentComponent = componentFile.split('.')[0]
    const pathToCurrentComponent = path.join(pathToComponents, componentFile)

    const templateData = await readFile(pathToDistHtml, 'utf-8')
    const componentData = await readFile(pathToCurrentComponent, 'utf-8')

    const result = templateData.replace(`{{${nameOfCurrentComponent}}}`, componentData.toString())

    await writeFile(pathToDistHtml, result)

  }

}
build()

