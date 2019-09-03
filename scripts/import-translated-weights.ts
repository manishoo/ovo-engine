/*
 * import-translated-weights.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '../src/models/food.model'
import { LanguageCode, Translation } from '../src/types/common'
import weightTokens from './weight-unique-tokens-fa.json'


function getEnTranslation(tr: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)
  if (enTr) {
    return enTr.text
  }

  return
}

async function translateWeights() {
  const foods = await FoodModel.find()

  for (let food of foods) {
    food.weights = food.weights.map(weight => {
      const foundWeight = weightTokens.find(p => p.token === getEnTranslation(weight.name))

      if (!foundWeight) {
        console.error('Weight not found: ' + getEnTranslation(weight.name))
        return weight
      }
      if (!foundWeight.tr) throw new Error('Weight translation not found')

      const enName = getEnTranslation(weight.name)
      if (!enName) throw new Error('no en')

      weight.name = [
        {
          locale: LanguageCode.en,
          text: enName,
          verified: true,
        },
        {
          locale: LanguageCode.fa,
          text: foundWeight.tr,
          verified: false,
        }
      ]

      return weight
    })

    await FoodModel.updateOne({_id: food._id}, food)
    // await food.save()
    process.stdout.write('.')
  }
}

export default async function main() {
  return translateWeights()
}
