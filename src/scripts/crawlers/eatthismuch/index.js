const MongoClient = require('mongodb').MongoClient
const Crawler = require('crawler')

const url = 'mongodb://localhost:27017'
let Recipe
let Food

const startId = process.env.START_ID || 1
const endId = process.env.END_ID || 50000

async function getRecipeUrls() {
  const uris = []
  const recipes = await Recipe.find({}, {
    _id: 0,
    id: 1
  }).toArray().then(res => res.map(it => it.id).reduce((pre, it) => ({ ...pre, [it]: true }), {}))
  for (let i = endId; i > startId; i--) {
    if (!recipes[i])
      uris.push(`https://www.eatthismuch.com/api/v1/recipe/${i}`)
  }
  return uris
}

async function processPage(error, res, done) {
  if (error) {
    console.log(`error: ${error.message}`)
    return done()
  }

  const recipe = JSON.parse(res.body)

  console.log(`${recipe.id} fetched...`)

  await Recipe.updateOne({ id: recipe.id }, { $set: recipe }, { upsert: true })

  done()
}

async function start() {
  return new Promise(async resolve => {
    const crawler = new Crawler({
      maxConnections: 1,
      jQuery: false,
      callback: processPage,
    })

    const uris = await getRecipeUrls()
    if (uris.length === 0) return resolve('finish')

    crawler.queue(uris)

    let progress = 0
    crawler.on('request', () => {
      console.log(`request ${++progress}/${uris.length}`)
    })

    crawler.on('drain', async function () {
      resolve('finish')
    })
  })
}

MongoClient.connect(url, async function (err, client) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Connected successfully to server')

  const db = client.db('eatthismuch-db')
  Recipe = db.collection('recipes')
  Food = db.collection('foods')

  await start()

  console.log('Finish...')

  client.close()
})
