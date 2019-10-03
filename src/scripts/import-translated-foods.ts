/*
 * import-translated-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel, FoodGroupSchema } from '@Models/food-group.model'
import { FoodModel } from '@Models/food.model'
import { LanguageCode, Translation } from '@Types/common'
import uniqueTokens from './food-unique-tokens-fa.json'


function getEnTranslation(tr: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)
  if (enTr) {
    return enTr.text
  }

  return
}

function addFaTranslation(translations: Translation[]) {
  const enTranslation = getEnTranslation(translations)

  if (!enTranslation) throw new Error('no translation')

  const tr = uniqueTokens.find(p => p.token === enTranslation)
  if (!tr) throw new Error(`no farsi translation found for ${enTranslation}`)

  return [
    {
      locale: LanguageCode.en,
      text: enTranslation,
      verified: true,
    },
    {
      locale: LanguageCode.fa,
      text: tr.tr,
      verified: false,
    }
  ]
}

export default async function main() {
  const foods = await FoodModel.find()
  const foodClasses = await FoodClassModel.find()
  const foodGroups = await FoodGroupModel.find()

  const foodGroupsSaved = await Promise.all(foodGroups.map(async food => {
    food.name = addFaTranslation(food.name)

    return food.save()
  }))
  const foodClassesSaved = await Promise.all(foodClasses.map(async food => {
    food.name = addFaTranslation(food.name)
    const foodGroup = foodGroupsSaved.find(p => String(p._id) === String(food.foodGroup._id))
    if (!foodGroup) throw new Error('no food class for this food')
    food.foodGroup = foodGroup
    return food.save()
  }))
  await Promise.all(foods.map(async food => {
    food.name = addFaTranslation(food.name)
    const foodClass = foodClassesSaved.find(p => String(p._id) === String(food.foodClass))
    if (!foodClass) throw new Error('no food class for this food')
    food.origFoodClassName = foodClass.name
    food.foodGroup = foodClass.foodGroup as FoodGroupSchema

    return food.save()
  }))
}
