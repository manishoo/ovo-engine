const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'recipes-db';

const regex = /[۰-۹]/g;

function translateNumbs(str) {
  if (typeof str === 'number') return str;
  return str.replace(regex, function(w) {
        return String.fromCharCode(w.charCodeAt(0) - 1728);
      },
  );
}

function convert(number) {
  const base = parseFloat(number);
  if (number.toLowerCase().match(/k/)) {
    return Math.round(base * 1000);
  } else if (number.toLowerCase().match(/m/)) {
    return Math.round(base * 1000000);
  } else if (number.toLowerCase().match(/b/)) {
    return Math.round(base * 1000000000);
  }
}

async function start(db) {
  const Recipes = db.collection('recipes');

  const recipes = await Recipes.find().toArray();

  return Promise.all(recipes.map(async (it) => {
    let likes = convert(translateNumbs(it.likes));
    const serveCount = Number(translateNumbs(it.serveCount));
    const cookTime = Number(translateNumbs(it.cookTime));
    const difficulty = Number(translateNumbs(it.difficulty));
    const prepTime = Number(translateNumbs(it.prepTime));

    return Recipes.updateOne({ id: it.id }, { $set: { likes, serveCount, cookTime, prepTime, difficulty } });
  }));
}

MongoClient.connect(url, async function(err, client) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Connected successfully to server');

  const db = client.db(dbName);

  await start(db);

  client.close();
});
