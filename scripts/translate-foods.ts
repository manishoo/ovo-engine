/*
 * translate-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translate } from '@google-cloud/translate'
import fs from 'fs'
import { FoodClassModel } from '../src/models/food-class.model'
import { FoodGroupModel } from '../src/models/food-group.model'
import { FoodModel } from '../src/models/food.model'
import { LanguageCode, Translation } from '../src/types/common'
import uni from './food-unique-tokens-fa.json'


function getEnTranslation(tr: Translation[]) {
  if (tr.length === 0) return

  const enTr = tr.find(t => t.locale === LanguageCode.en)
  if (enTr) {
    return enTr.text
  }

  return
}

function sleep(t: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}

async function main() {
  const uniqueTokens: { token: string, tr?: string }[] = uni

  /**
   * Gather foods
   * */
  const foods = await FoodModel.find()
  const foodClasses = await FoodClassModel.find()
  const foodGroups = await FoodGroupModel.find()

  foods.map(food => {
    const token = getEnTranslation(food.name)

    if (token) {
      if (uniqueTokens.find(p => p.token === token)) return
      uniqueTokens.push({
        token,
      })
    }
  })

  foodClasses.map(foodClass => {
    const token = getEnTranslation(foodClass.name)

    if (token) {
      if (uniqueTokens.find(p => p.token === token)) return

      uniqueTokens.push({
        token,
      })
    }
  })

  foodGroups.map(foodGroup => {
    const token = getEnTranslation(foodGroup.name)

    if (token) {
      if (uniqueTokens.find(p => p.token === token)) return

      uniqueTokens.push({
        token,
      })
    }
  })

  let s = ''
  let ss: string[] = []
  uniqueTokens
    .map(({ token }) => {
      if (`${token}\n${s}`.length < 5000) {
        s = `${token}\n${s}`
      } else {
        ss.push(s)
        s = `${token}`
      }
    })
  if (s.length > 0) ss.push(s)

  const translate = new Translate({ projectId: 'firebase-hampa', key: 'AIzaSyAYo209w8E_Q9a8OHaDalpCCk3ioq5-y0g' })

  for (let i = 0; i < ss.length; i++) {
    process.stdout.write('.')
    let text = ss[i]
    await sleep(5000) // Needed in order not to exceed google limit
    const [translation] = await translate.translate(text, { from: 'en', to: 'fa' })

    const splitTranslations = translation
      .split('\n')
    text
      .split('\n')
      .map((token, index) => {
        if (!token) return null
        const foundIndex = uniqueTokens.findIndex(p => {
          return p.token == token
        })
        if (foundIndex < 0) throw new Error('Something went wrong')

        uniqueTokens[foundIndex].tr = splitTranslations[index]
      })
  }

  uniqueTokens.sort(function (a, b) {
    if (a.token < b.token) return -1
    if (a.token > b.token) return 1
    return 0
  })

  fs.writeFileSync('unique-tokens.json', JSON.stringify(uniqueTokens), 'utf8')
}

main()
  .then(() => process.exit(0))
  .catch(e => console.log(e))
