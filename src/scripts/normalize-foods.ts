/*
 * normalize-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 * This script must be run after migration
 */

import attachFoodImagesFromFoodClasses from './attach-food-images-from-food-classes'
import attachFooDBImagesToDb from './attach-foodb-images-to-db'
import createFoodNutrition from './create-food-nutrition'
import createPanelAdmin from './create-panel-admin'
import deleteFoodDuplicates from './delete-food-duplicates'
import importSarashpazpapionRecipes from './import-sarashpazpapion-recipes'
import importTranslatedFoods from './import-translated-foods'
import importTranslatedWeights from './import-translated-weights'
import selectFoodClassDefaultFoods from './select-food-class-default-foods'
import separateFoodDescription from './separate-food-description'


const argv = require('minimist')(process.argv.slice(2))

async function main() {
  console.log('Running importTranslatedFoods...')
  await importTranslatedFoods()

  console.log('Running importTranslatedFoods...')
  await importTranslatedFoods()

  console.log('Running importTranslatedWeights...')
  await importTranslatedWeights()

  console.log('Running attachFoodImagesFromFoodClasses...')
  await attachFoodImagesFromFoodClasses()

  console.log('Running attachFooDBImagesToDb...')
  await attachFooDBImagesToDb()

  console.log('Running deleteFoodDuplicates...')
  await deleteFoodDuplicates()

  console.log('Running separateFoodDescription...')
  await separateFoodDescription()

  console.log('Running selectFoodClassDefaultFoods...')
  await selectFoodClassDefaultFoods()

  console.log('Running createFoodNutrition...')
  await createFoodNutrition()

  console.log('Running createPanelAdmin...')
  await createPanelAdmin('admin', String(argv.p || 'admin'))

  console.log('Running importSarashpazpapionRecipes...')
  await importSarashpazpapionRecipes('i]6s-v:IJW7f')

  process.exit(0)
}

main()
