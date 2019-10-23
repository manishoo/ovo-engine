/*
 * delete-food-duplicates.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 * This script will delete food duplicates
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import { LanguageCode, Translation } from '@Types/common'
import { DeleteBy } from '@Utils/delete-by'

const argv = require('minimist')(process.argv.slice(2))

function getEnTranslation(tr: Translation[], descTr?: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)

  if (enTr) {
    if (descTr) {
      const descEnTr = descTr.find(t => t.locale === LanguageCode.en)

      if (descEnTr) {
        return `${enTr.text}, ${descEnTr.text}`
      }
    }

    return enTr.text
  }

  return
}

export default async function main() {
  const foodClasses = await FoodClassModel.find()

  // await FoodModel.restore({})

  for (let foodClass of foodClasses) {
    const foods = await FoodModel.find({ foodClass: foodClass._id })

    for (let food of foods) {
      const foodsWithTheSameName = foods.filter(f => getEnTranslation(f.name, f.description) === getEnTranslation(food.name, food.description))

      /**
       * If a food was usda then remove other foods with the same name
       * */
      const usdaFood = foodsWithTheSameName.find(f => f.origDb === 'usda')

      if (usdaFood) {
        for (let foodSameName of foodsWithTheSameName) {
          if (String(foodSameName._id) === String(usdaFood._id)) continue

          console.log(`Deleting ${getEnTranslation(foodSameName.name, foodSameName.description)} with id ${foodSameName._id}`)
          await foodSameName.delete(DeleteBy.system('delete-food-duplicates.ts#usda'))
        }
      } else {
        /**
         * Does some food in foods with the same name have weights?
         * */
        const foodWithWeight = foodsWithTheSameName.find(f => f.weights.length > 0)
        if (foodWithWeight) {
          /**
           * Select the one with weights
           * */
          for (let foodSameName of foodsWithTheSameName) {
            if (String(foodSameName._id) === String(foodWithWeight._id)) continue

            console.log(`Deleting ${getEnTranslation(foodSameName.name, foodSameName.description)} with id ${foodSameName._id}`)
            await foodSameName.delete(DeleteBy.system('delete-food-duplicates.ts#weight'))
          }
        } else {
          /**
           * Select the first one
           * */
          for (let i = 0; i < foodsWithTheSameName.length; i++) {
            const foodSameName = foodsWithTheSameName[i]
            if (i === 0) continue

            console.log(`Deleting ${getEnTranslation(foodSameName.name, foodSameName.description)} with id ${foodSameName._id}`)
            await foodSameName.delete(DeleteBy.system('delete-food-duplicates.ts#firstindex'))
          }
        }
      }
    }
  }
}

if (argv.run) {
  main()
    .then(() => {
      console.log('DONE')
    })
}
