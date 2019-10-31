/*
 * validate-food-groups.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { ObjectId } from "@Types/common"
import { FoodGroupModel } from "@Models/food-group.model"
import Errors from "@Utils/errors"


export default async function validateFoodGroups(foodGroupIncludes: ObjectId[]) {
  const foodGroups = await FoodGroupModel.find({ _id: { $in: foodGroupIncludes } })
  if (foodGroups.length !== foodGroupIncludes.length) throw new Errors.Validation('Invalid food group id')
}