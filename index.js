const fs = require('fs');
const util = require('util');

const melakarta = require('./melakarta.json');
const svara = require('./svara.json');
const template = require('./template');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const generate = async () => {
  for (const [chakra, ragas] of Object.entries(melakarta)) {
    try {
      await mkdir(`./Melakarta/${chakra}`);
    } catch (e) {}

    for (const [raga, notes] of Object.entries(ragas)) {
      const arr = notes.split(/\s/);
      const map = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      arr.forEach((a) => {
        if (typeof svara[a] === 'undefined') {
          throw 'Cannot process ' + a;
        }
        map[svara[a]] = svara[a];
      });

      for (let i = 0; i < map.length; i++) {
        if (
          typeof map[i + 1] === 'undefined' &&
          typeof map[i - 1] === 'undefined'
        ) {
          throw `Cannot process ${raga} for ${map.toString()}`;
        }

        if (map[i + 1] === -1 && map[i + 1] > -1) {
          map[i] = map[i + 1];
        }

        if (map[i] === -1 && map[i - 1] > -1) {
          map[i] = map[i - 1];
        }
      }

      await writeFile(
        `./Melakarta/${chakra}/${raga}.adv`,
        template.getTranspiledXml(map)
      );
      console.log(`Created  ${chakra}/${raga}.adv!`);
    }
  }
};

generate();
