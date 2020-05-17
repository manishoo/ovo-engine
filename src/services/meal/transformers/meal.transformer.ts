/*
 * meal.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Meal } from '@Types/meal'
import { InstanceType } from 'typegoose'


export function transformMeal(meal: InstanceType<Meal>): Meal {
  return meal.toObject()
}
