/*
 * map-sarashpazpapion.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 *
 * This script will iterate all of the recipes of
 * sarashpazpapion account and add all of its unlinked unique ingredients
 * to an array and creates a *FoodMap* for each of them.
 * These FoodMaps are then used in the panel to link the ingredients
 * of recipes to an actual food in the database
 */

import { FoodMapModel } from '@Models/food-map.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import { FoodMap } from '@Types/food-map'


const argv = require('minimist')(process.argv.slice(2))

export default async function main() {
  const sarashpazpapion = await UserModel.findOne({ username: 'sarashpazpapion' })
  if (!sarashpazpapion) throw new Error('sarashpazpapion not found')
  const recipes = await RecipeModel.find({ author: sarashpazpapion._id })
  const uniqueIngredients: (Partial<FoodMap> & { count: number })[] = []

  recipes.map(recipe => {
    recipe.ingredients.map(ingredient => {
      if (ingredient.item) return

      if (ingredient.name) {
        const foundIngredient = uniqueIngredients.find(p => p.text === ingredient.name![0].text)
        if (foundIngredient) {
          foundIngredient.count += 1
          if (ingredient.customUnit && !foundIngredient.units!.find(p => !!ingredient.customUnit!.name.find(name => name.text === p.text))) {
            foundIngredient.units!.push({
              text: ingredient.customUnit.name[0].text,
            })
          }
        } else {
          const tr = ingredient.name[0]
          const units = []
          if (ingredient.customUnit) {
            units.push({
              text: ingredient.customUnit.name[0].text,
            })
          }
          uniqueIngredients.push({
            ...tr,
            units,
            count: 1,
          })
        }
      }
    })
  })

  uniqueIngredients.sort(function (a, b) {
    if (a.count < b.count) return 1
    if (a.count > b.count) return -1
    return 0
  })

  await FoodMapModel.create(uniqueIngredients.map(uniqueIngredient => ({
    ...uniqueIngredient,
    usageCount: uniqueIngredient.count,
    verified: false,
  } as Partial<FoodMap>)))
}

if (argv.run) {
  main()
    .then(() => {
      console.log('FINISHED')
      process.exit(0)
    })
}
