/*
 * import-translated-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
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
  if (!tr) throw new Error('no farsi translation found')

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

  await Promise.all(foods.map(async food => {
    food.name = addFaTranslation(food.name)

    return food.save()
  }))
  await Promise.all(foodClasses.map(async food => {
    food.name = addFaTranslation(food.name)

    return food.save()
  }))
  await Promise.all(foodGroups.map(async food => {
    food.name = addFaTranslation(food.name)

    return food.save()
  }))
}
