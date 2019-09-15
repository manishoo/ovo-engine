/*
 * delete-food-duplicates.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 * This script will delete food duplicates
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import { LanguageCode, Translation } from '@Types/common'


function getEnTranslation(tr: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)
  if (enTr) {
    return enTr.text
  }

  return
}

export default async function main() {
  const foodClasses = await FoodClassModel.find()

  for (let foodClass of foodClasses) {
    const foods = await FoodModel.find({ foodClass: foodClass._id })

    for (let food of foods) {
      const foodsWithTheSameName = foods.filter(f => getEnTranslation(f.name) === getEnTranslation(food.name))

      /**
       * If a food was usda then remove other foods with the same name
       * */
      const usdaFood = foodsWithTheSameName.find(f => f.origDb === 'usda')

      if (usdaFood) {
        for (let foodSameName of foodsWithTheSameName) {
          if (String(foodSameName._id) === String(usdaFood._id)) continue

          console.log(`Deleting ${foodSameName._id}`)
          // await foodSameName.delete()
        }
      }
    }
  }
}
