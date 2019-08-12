/*
 * self-user.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LanguageCode } from '@Types/common'
import { User } from '@Types/user'
import { InstanceType } from 'typegoose'


export default async function transformSelfUser(userDocument: InstanceType<User>, lang: LanguageCode = LanguageCode.en) {
  userDocument = userDocument.toObject()
  userDocument.id = String(userDocument.publicId)
  if (userDocument.path) {
    // FIXME PLEASE! :(((
    let recipes: string[] = []
    let foods: string[] = []

    userDocument.path.map(({ meal }) => {
      if (meal) {
        meal.items.map(item => {
          switch (item.type) {
            case 'recipe':
              if (!recipes.find(p => p === item.id)) {
                return recipes.push(item.id)
              }
              return
            case 'food':
              // weights.push(item)
              if (!foods.find(f => f === item.id)) {
                return foods.push(item.id)
              }
              return
            default:
              return
          }
        })
      }
    })
  }
  return userDocument
}
