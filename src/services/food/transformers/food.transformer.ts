/*
 * food.transformer.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { getFoodTranslation } from '@Services/food/utils/get-food-translation'
import { getGroupName } from '@Services/food/utils/get-group-name'
import { transformWeights } from '@Services/weight/transformers/weight.transformer'
import { Food } from '@Types/food'
import { foodsInstance } from '@Types/food-database'
import Errors from '@Utils/errors'
import { setImageUrl } from '@Utils/image-url-setter'
import { LanguageCode } from '@Types/common'

export async function transformFood(food: foodsInstance, lang: LanguageCode, withNutrients: boolean, withWeights: boolean): Promise<Food> {
	if (!food.foodGroup) throw new Errors.Validation('food group empty')

	return {
		id: food.publicId,
		name: getFoodTranslation(food.translations, lang).name,
		description: getFoodTranslation(food.translations, lang).description,
		foodGroup: await getGroupName(food.foodGroup, lang),
		image: food.pictureFileName ? { url: setImageUrl(food.pictureFileName, false, food.id!) } : undefined,
		// nutrients: withNutrients ? await transformNutrients(food.contents, lang) : undefined,
		weights: withWeights ? await transformWeights(food.weights || [], lang) : undefined,
	}
}
