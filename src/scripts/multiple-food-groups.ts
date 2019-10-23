/*
 * multiple-food-groups.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodClassModel } from '@Models/food-class.model'
import { FoodGroupModel } from '@Models/food-group.model'
import { FoodGroup } from '@Types/food-group'


async function main() {
  const foodClasses = await FoodClassModel.find()
  const foodGroups = await FoodGroupModel.find()

  function getFullFoodGroups(foodGroupId: string): Partial<FoodGroup>[] {
    const fg = foodGroups.find(i => i.id === foodGroupId)
    if (!fg) throw new Error('no fg')

    if (fg.parentFoodGroup) {
      return [
        ...getFullFoodGroups(fg.parentFoodGroup.toString()),
        {
          name: fg.name,
          id: fg._id,
        },
      ]
    } else {
      return [
        {
          name: fg.name,
          id: fg._id,
        }
      ]
    }
  }

  for (let foodClass of foodClasses) {
    foodClass.foodGroups = [
      getFullFoodGroups(foodClass.toObject().foodGroup._id.toString())
    ]
    await foodClass.save()
    process.stdout.write('.')
  }

  process.exit(0)
}

main()
