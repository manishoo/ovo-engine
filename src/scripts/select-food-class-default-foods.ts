/*
 * select-food-class-default-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'
import { LanguageCode, Translation } from '@Types/common'
import { DeleteBy } from '@Utils/delete-by'

const argv = require('minimist')(process.argv.slice(2))

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

    let shortestFoodId = undefined
    let shortestFoodName = ''
    let shortestFood

    if (foods.length === 0) {
      console.log(`Deleting ${getEnTranslation(foodClass.name)} - ${foodClass.id} - ${foodClass.origId}`)
      await foodClass.delete(DeleteBy.system('select-food-class-default-foods.ts'))
      continue
    }

    if (!foods.find(f => f.origDb === 'usda')) {
      /**
       * If foods didn't contain any usda foods
       * */
      for (let food of foods) {
        const enName = getEnTranslation(food.name)
        if (!enName) throw new Error('en tr not found')
        if (shortestFoodId) {
          if (enName.length < shortestFoodName.length) {
            shortestFoodName = enName
            shortestFood = food
            shortestFoodId = food._id
          }
        } else {
          shortestFoodName = enName
          shortestFood = food
          shortestFoodId = food._id
        }
      }
    } else {
      for (let food of foods) {
        if (food.origDb === 'usda') {
          const enName = getEnTranslation(food.name)
          if (!enName) throw new Error('en tr not found')
          if (shortestFoodId) {
            if (enName.length < shortestFoodName.length) {
              shortestFoodName = enName
              shortestFood = food
              shortestFoodId = food._id
            }
          } else {
            shortestFoodName = enName
            shortestFood = food
            shortestFoodId = food._id
          }
        }
      }
    }

    if (!shortestFoodId) throw new Error('no food selected')
    if (!shortestFood) throw new Error('no food selected')

    foodClass.defaultFood = shortestFoodId
    await foodClass.save()
    shortestFood.isDefault = true
    await shortestFood.save()
    process.stdout.write('.')
  }
}

if (argv.run) {
  main()
    .then(() => {
      console.log('DONE')
    })
}
