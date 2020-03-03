/*
 * find-nutrient-units.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
const fs = require('fs').promises

import 'reflect-metadata'


const argv = require('minimist')(process.argv.slice(2))

export default async function main() {
  let foods = await FoodModel.find()
    .select('nutrition')
    .exec()

  const nutritionsAndUnits: {[k: string]: string[]} = {}

  foods.map(({ nutrition }) => {
    Object.keys(nutrition).map(nutrientKey => {
      const nutrient = nutrition[nutrientKey]!
      if (nutritionsAndUnits[nutrientKey]) {
        if (!nutritionsAndUnits[nutrientKey].find(p => p === nutrient.unit)) {
          nutritionsAndUnits[nutrientKey].push(nutrient.unit)
        }
      } else {
        nutritionsAndUnits[nutrientKey] = [nutrient.unit]
      }
    })
  })

  await fs.writeFile(
    'nutritionsAndUnits.json',
    JSON.stringify(nutritionsAndUnits),
    { encoding: 'utf8' })
}

if (argv.run) {
  main()
    .then(() => {
      console.log('DONE')
    })
}
