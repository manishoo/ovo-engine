/*
 * get-food-classes-from-diets.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { ObjectId } from '@Types/common'
import { Diet } from '@Types/diet'


export default async function getFoodClassIdsFromDiets(diets: Diet[]): Promise<ObjectId[]> {
  const allFoodGroupIncludes: ObjectId[] = []
  const allFoodClassIncludes: ObjectId[] = []

  diets.map(diet => {
    allFoodGroupIncludes.push(...diet.foodGroupIncludes)
    allFoodClassIncludes.push(...diet.foodClassIncludes)
  })

  const foodClasses = await FoodClassModel.find({
    _id: { $in: allFoodClassIncludes },
    'foodGroups.0.id': { $in: allFoodGroupIncludes }
  }).select('_id').exec()

  return foodClasses.map(fc => fc._id)
}
