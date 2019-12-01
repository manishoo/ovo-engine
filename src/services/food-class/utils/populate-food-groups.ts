/*
 * populate-food-groups.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodGroupModel } from '@Models/food-group.model'
import { FoodGroup } from '@Types/food-group'


export default async function populateFoodGroups(foodGroupIds: string[][]): Promise<FoodGroup[][]> {
  const foodGroups = await FoodGroupModel.find()

  return foodGroupIds.map(fgs => (
    fgs.map(fg => {
      const foundFg = foodGroups.find(p => String(p._id) === fg)
      if (!foundFg) throw new Error('invalid food group')
      return {
        ...foundFg,
        id: foundFg._id,
        name: foundFg.name,
      }
    })
  ))
}
