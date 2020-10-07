This empty project has been created to code and deploy easily : PWA + react or simple html/css/js pages.

### Installation

```
git clone https://github.com/kaonL0/hackathon-macdonalgue.git
cd hackathon-macdonalgue
npm install
npm install -g serve
```

### dev

```
# http://localhost:3000/
npm start
```

### production

```
# http://localhost:5000/
npm run build
serve -s build
```

Drag build directory in netifly backend.

Application is available here : https://hackathon-macdonalgue.netlify.app/

### Data management

Here is the data folder to avoid bdd.

```
data
  species // dir for all species
    specie-001 // dir for specie
      metadata.json // metadata for this specie
      image.jpg // other media
    specie-002
      metadata.json
      image.jpg
    species.json // list of species generated according to species content
```

To build species.json file in data/species/ dir run :

```
npm run create:json:species

```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).