/*
 * attach-foodb-images-to-db.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import config from '../config'


const argv = require('minimist')(process.argv.slice(2))
const download = require('image-downloader')
const fs = require('fs-extra')

export default async function main() {
  const foodClasses = await FoodClassModel.find()
  const errors: any[] = []

  for (let fc of foodClasses) {
    const basePath = `${config.uploadUrl}/images/food-classes/${fc.slug}`
    await fs.ensureDirSync(basePath)

    try {
      const { filename } = await download.image({
        url: `http://foodb.ca/system/foods/pictures/${fc.origId}/full/${fc.origId}.png`,
        dest: `${basePath}/full.png`,
      })
      fc.imageUrl = { url: filename }
    } catch (e) {
      console.log(e)
      errors.push(e)
    }
    try {
      const { filename } = await download.image({
        url: `http://foodb.ca/system/foods/pictures/${fc.origId}/thumb/${fc.origId}.png`,
        dest: `${basePath}/thumb.png`,
      })
      fc.thumbnailUrl = { url: filename }
    } catch (e) {
      console.log(e)
      errors.push(e)
    }

    await fc.save()
    process.stdout.write('.')
  }

  fs.writeFileSync(
    './errors.json',
    JSON.stringify(errors),
    { encoding: 'utf8' })
}

if (argv.run) {
  main()
    .then(() => {
      console.log('FINISHED')
      process.exit(0)
    })
}
