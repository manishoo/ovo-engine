/*
 * normalize-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 *
 * This script must be run after migration
 */

import importTranslatedFoods from './import-translated-foods'
import importTranslatedWeights from './import-translated-weights'
import deleteFoodDuplicates from './delete-food-duplicates'
import selectFoodClassDefaultFoods from './select-food-class-default-foods'
import attachFooDBImagesToDb from './attach-foodb-images-to-db'

async function main() {
  console.log('Running importTranslatedFoods...')
  await importTranslatedFoods()
  console.log('Running importTranslatedWeights...')
  await importTranslatedWeights()
  console.log('Running attachFooDBImagesToDb...')
  await attachFooDBImagesToDb()
  console.log('Running deleteFoodDuplicates...')
  await deleteFoodDuplicates()
  console.log('Running selectFoodClassDefaultFoods...')
  await selectFoodClassDefaultFoods()
  process.exit(0)
}

main()
