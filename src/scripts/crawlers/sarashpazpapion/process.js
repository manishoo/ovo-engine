const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function start(db1, db2) {
  const Recipe = db1.collection('recipes');
  const Food = db2.collection('foods');
  /*
    const foods = await Food.find().toArray();
    await Promise.all(foods.map(async (it) => {
      return Food.updateOne({ _id: it._id }, { $set: { name: it.name.fa } });
    }));
  */

   await Food.createIndex({ name: 'text' });
  // await Food.dropIndex('name_text');

  const res = await Recipe.aggregate([
    { $unwind: '$ingredients' },
    { $addFields: { name: '$ingredients.name', count: 1 } },
    { $project: { _id: 0, name: 1, count: 1 } },
    { $group: { _id: { 'name': '$name' }, count: { $sum: '$count' } } },
    { $sort: { count: -1 } },
    { $limit: 100 },
  ]).toArray();

  const aaa = await Promise.all(res.map(async (it, i) => {
    const a = await Food.findOne({ $text: { $search: '' } });

    console.log(a);

    it.food = a;

    return it;
  }));

  const f = aaa.filter((it) => it.food != null);

  console.log(f.length);
}

MongoClient.connect(url, async function(err, client) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Connected successfully to server');

  const db1 = client.db('recipes-db');
  const db2 = client.db('foodb');

  await start(db1, db2);

  client.close();
});
