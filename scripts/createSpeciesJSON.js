const fs = require('fs');
const fetch = require('node-fetch');

const dataSpeciesDir = `${__dirname}/../public/data/species`;
const urlSpecies = 'http://127.0.0.1:8080/data/species/'
const speciesJSONFile = `${__dirname}/../public/data/species/species.json`;
const urlJSONSpecies = `${urlSpecies}species.json`

let jsonMetadata = {
  author: "LDR",
  version: "1.0.0",
  url: urlJSONSpecies,
  species: []
};

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.includes('metadata.json')) files_.push(name);
    }
  }
  return files_;
}

/* search metadata.json files */
let fileList = getFiles(dataSpeciesDir);
console.log(fileList)

let promiseList = [];
fileList.forEach(element => {
  const indexMetadata = element.indexOf('species');
  const indexAfterMetadata = indexMetadata + 8;
  const indexLastSlash = element.lastIndexOf('/');
  const removeMetadata = element.substring(indexAfterMetadata);
  const url = `${urlSpecies}${removeMetadata}`;
  const key = element.substring(indexAfterMetadata, indexLastSlash);

  const currentPromise = fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(json => {
      console.log(key, json.key);
      if (key !== json.key) {
        throw new Error("Le nom du repertoire ne correspond pas à la clé.");
      }

      const specieEntry = { key: json.key, name: json.name, genre: json.genre, url }
      console.log('fetch', url, specieEntry)
      jsonMetadata.species.push(specieEntry);
    })
    .catch(err => {
      this.dataError = true;
      throw new Error("Erreur lors de la récupération des données. " + err);
    })

  promiseList.push(currentPromise)
});

Promise
  .all(promiseList)
  .then(() => {
    jsonMetadata.species.sort((a, b) => (a.key > b.key) ? 1 : -1)
    console.log(`all requests finished, ${jsonMetadata.species.length} species found`);

    const fileData = JSON.stringify(jsonMetadata, null, 2);
    fs.writeFile(speciesJSONFile, fileData, function (err, result) {
      if (err) console.log('error', err);
    });
  });

