const fs = require('fs').promises
const path = require('path')
const Crawler = require('crawler')

const endId = process.env.END_ID || 10
const startId = process.env.START_ID || 1

const recipesPath = `recipes(${startId}-${endId}).json`
const errorsPath = `errors(${startId}-${endId}).json`

const recipes = []
const errors = []

async function getRecipeUrls() {
  const uris = []
  for (let i = startId; i <= endId; i++) {
    uris.push(`https://sarashpazpapion.com/recipe/${i}`)
  }
  return uris
}

async function processPage(error, res, done) {
  try {
    if (error) {
      errors.push({ error })
      return done()
    }

    const path = res.req.path
    const id = res.req.path.split('/')[2]

    try {
      const { $ } = res
      const imageRaw = $('body > div.main-container.m-t-1 > div > div.r-p-9 > div.panel.panel-white.item-pic-recipe > div.image-container > img')
      const categoriesRaw = $('body > div.main-container.m-t-1 > div > div.r-p-9 > div.panel.panel-white.item-pic-recipe > div.r-title.clearfix > div.pull-right > ol')
      const likesRaw = $('body > div.main-container.m-t-1 > div > div.r-p-9 > div.panel.panel-white.item-pic-recipe > div.r-title.clearfix > div.pull-left > div:nth-child(2) > a')
      const serveCountRaw = $('.recipe-content .recipe-ing .ing-h .num')
      const ingredientsRaw = $('.recipe-content .r-p-i .recipe-ing.panel.panel-white')
      const prepTimeRaw = $('.recipe-steps.panel.panel-white .steps-time div:nth-child(1)')
      const cookTimeRaw = $('.recipe-steps.panel.panel-white .steps-time div:nth-child(2)')
      const instructionRaw = $('.recipe-steps.panel.panel-white')
      const notesRaw = $('.recipe-other-notes.panel.panel-white')
      const difficultyRaw = $('.recipe-steps.panel.panel-white .steps-h.text-xs-center .hard')
      const tagsRaw = $('head > meta')

      const image = { url: imageRaw.attr('src'), alt: imageRaw.attr('alt') }

      const categories = []
      categoriesRaw.children().each((i, el) => {
        const row = $(el).find('a').text().replace(/\s\s+/g, ' ').trim()
        if (row) categories.push(row)
      })
      const title = categories.pop() // last item is food title
      categories.shift() // to remove first item which is website name

      const likes = $(likesRaw).text()
      const serveCount = $(serveCountRaw).text()
      const difficulty = $(difficultyRaw).attr('class').split(' ')[0].replace('h', '')

      const ingredients = []
      ingredientsRaw.children().each((i, el) => {
        const name = $(el).find('.ing-title').text().replace(/\s\s+/g, ' ').trim()
        const quantity = $(el).find('.ing-unit').text().replace(/\s\s+/g, ' ').trim()
        if (name) ingredients.push({ name, quantity })
      })

      const prepTime = $(prepTimeRaw).text().replace(/\s\s+/g, ' ').split(' ')[3]
      const cookTime = $(cookTimeRaw).text().replace(/\s\s+/g, ' ').split(' ')[3]

      const instruction = []
      instructionRaw.children().each((i, el) => {
        const row = $(el).find('.step-t .step-text').text().replace(/\s\s+/g, ' ').trim()
        if (row) instruction.push(row)
      })

      const notes = []
      notesRaw.children().each((i, el) => {
        const row = $(el).text().replace(/\s\s+/g, ' ').trim()
        if (row) notes.push(row)
      })
      notes.shift() // remove recipe name

      const tags = []
      tagsRaw.each((i, el) => {
        if ($(el).attr('property') !== 'article:tag') return
        const row = $(el).attr('content').replace(/\s\s+/g, ' ').trim()
        if (row) tags.push(row)
      })

      const result = {
        id,
        title,
        image,
        prepTime,
        cookTime,
        serveCount,
        difficulty,
        likes,
        categories,
        ingredients,
        instruction,
        notes,
        tags,
        path,
      }

      recipes.push(result)
      return done()
    } catch (e) {
      console.log(e)
      errors.push({ id, error })
      return done()
    }
  } catch (e) {
    console.error(e)
    return done()
  }
}

async function start() {
  const crawler = new Crawler({
    maxConnections: 25,
    callback: processPage,
  })

  const recipesExists = await fs.access(recipesPath, fs.F_OK).catch(() => false)

  if (recipesExists) {
    const json = await fs.readFile(recipesPath, { encoding: 'utf8' })
    recipes.push(JSON.parse(json.toString('utf8')))
  }

  const uris = await getRecipeUrls()
  crawler.queue(uris)

  let progress = 0
  crawler.on('request', () => {
    console.log(`request ${++progress}/${endId}`)
  })

  crawler.on('drain', async function () {
    await fs.writeFile(
      recipesPath,
      JSON.stringify(recipes),
      { encoding: 'utf8' })
    await fs.writeFile(
      errorsPath,
      JSON.stringify(errors),
      { encoding: 'utf8' })
  })
}

start().then(console.log)
