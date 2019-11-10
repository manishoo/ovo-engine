/*
 * validate-food-classes.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from "@Models/food-class.model"
import Errors from "@Utils/errors"
import { ObjectId } from "@Types/common"


export default async function validateFoodClasses(foodClassIncludes: ObjectId[]) {
  const foodClasses = await FoodClassModel.find({ _id: { $in: foodClassIncludes } })
  if (foodClasses.length !== foodClassIncludes.length) throw new Errors.Validation('Invalid food class id')
}