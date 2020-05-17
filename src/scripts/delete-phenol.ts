/*
 * delete-phenol.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodModel } from '@Models/food.model'


export default async function main() {
  return FoodModel.delete({ 'nutrition.calories': {$exists: false} })
}


main()
.then(() => console.log('done'))
