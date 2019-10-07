/*
 * normalize-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 * This script must be run after migration
 */

import importActivityList from './import-activity-list'


const argv = require('minimist')(process.argv.slice(2))

async function main() {
  // console.log('Running importTranslatedFoods...')
  // await importTranslatedFoods()
  //
  // console.log('Running importTranslatedWeights...')
  // await importTranslatedWeights()

  // console.log('Running attachFooDBImagesToDb...')
  // await attachFooDBImagesToDb()
  //
  // console.log('Running attachFoodImagesFromFoodClasses...')
  // await attachFoodImagesFromFoodClasses()

  // console.log('Running deleteFoodDuplicates...')
  // await deleteFoodDuplicates()
  //
  // console.log('Running separateFoodDescription...')
  // await separateFoodDescription()
  //
  // console.log('Running selectFoodClassDefaultFoods...')
  // await selectFoodClassDefaultFoods()

  //console.log('Running createFoodNutrition...')
  //await createFoodNutrition()
  //
  // console.log('Running createPanelAdmin...')
  // await createPanelAdmin('admin', String(argv.adminPass || 'adminpass'))

  // console.log('Running importSarashpazpapionRecipes...')
  // await importSarashpazpapionRecipes(argv.sarashpazpapionPass || '1')

  console.log('Running importActivityList...')
  await importActivityList()

  process.exit(0)
}

main()
