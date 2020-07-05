const fs = require('fs');
const util = require('util');

const melakarta = require('./melakarta.json');
const svara = require('./svara.json');
const template = require('./template');

const mkdir = util.promisify(fs.mkdir);
const deleteDir = util.promisify(fs.rmdir);
const exists = util.promisify(fs.exists);
const writeFile = util.promisify(fs.writeFile);

const exportFolderPath = './Melakarta';

const generate = async () => {
  
  if (await exists(exportFolderPath)) await deleteDir(exportFolderPath, { recursive: true });
  await mkdir(exportFolderPath);

  Object.entries(melakarta).map(async([chakra, ragas]) => {
    
      try {
        await mkdir(`${exportFolderPath}/${chakra}`);
      } catch (e) {
          console.log('Could not create directory', e);
      }

      Object.entries(ragas).map(async ([raga, notes]) => {

          let noteArray = notes.split(/\s/);
          let mappedRaga = [];
          let lastValue = 0;

          Object.entries(svara).map(([note, index]) => {
              let currentValue = noteArray.includes(note) ? index : lastValue;
              mappedRaga.push(currentValue);
              lastValue = index;
          })

          await writeFile(
              `./Melakarta/${chakra}/${raga}.adv`,
              template.getTranspiledXml(mappedRaga)
          );
          console.log(`Created  ${chakra}/${raga}.adv`);
      })
    });
};

generate();
