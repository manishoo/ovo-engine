/*
 * usda-scripts.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/*
// import UtensilRepo from 'models/Utensil.model'
import IngredientRepo, { Ingredient, __IngredientModel } from 'models/ingredient.model'

(async () => {
  // for (let i = 0; i < 100; i++) {
  //   const count = 1000
  //   const ingredients = await IngredientRepo.find({}, { skip: count * i, limit: count })
  //   if (ingredients.length === 0) {
  //     console.log('DONE')
  //     process.exit(0)
  //   }

  //   await Promise.all(ingredients.map(async (ingredient) => {
  //     await Promise.all(recipe.utensils.map(utensil => {
  //       return UtensilRepo.findOrCreate(utensil)
  //     }))
  //   }))
  // }


  async function deleteDups() {
    var duplicates = [];

    const result = await __IngredientModel.aggregate([
      {
        $match: {
          name: { "$ne": '' }  // discard selection criteria
        }
      },
      {
        $group: {
          _id: { name: "$name" }, // can be grouped on multiple properties
          dups: { "$addToSet": "$_id" },
          count: { "$sum": 1 }
        }
      },
      {
        $match: {
          count: { "$gt": 1 }    // Duplicates considered as count greater than one
        }
      }
    ])

    // For faster processing if set is larger )               // You can display result until this and check duplicates
    result.forEach(function (doc) {
      doc.dups.shift();      // First element skipped for deleting
      doc.dups.forEach(function (dupId) {
        duplicates.push(dupId);   // Getting all duplicate ids
      })
    })

    // If you want to Check all "_id" which you are deleting else print statement not needed
    console.log(duplicates.length);
    return __IngredientModel.deleteMany({ _id: { $in: duplicates } })
  }

  async function deleteNoCategories() {
    return __IngredientModel.deleteMany({ category: { $exists: false } })
  }

  async function trimNames() {
    for (let i = 0; i < 109999999990; i++) {
      const count = 10000
      const ingredients = await IngredientRepo.find({}, { skip: count * i, limit: count })
      if (ingredients.length === 0) {
        console.log('DONE')
        process.exit(0)
      }

      await Promise.all(ingredients.map(async (ingredient) => {
        const nameArray = ingredient.name.split(', ')
        delete nameArray[0]
        const details = nameArray.filter(Boolean).join(', ')

        ingredient.details = details
        ingredient.name = ingredient.name.replace(/,.*!/, '')
        ingredient.name = ingredient.name.replace(/"/, '')
        return ingredient.save()
      }))
    }
    return __IngredientModel.find()
  }

  return trimNames()
})()*/
