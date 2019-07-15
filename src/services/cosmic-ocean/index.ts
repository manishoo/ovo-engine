/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import request from 'request-promise'
import config from '@config'


interface TranslatedRecipePayload {
	version?: string,
	instructions: any,
	ingredients: any,
	latest?: boolean
}

export interface CosmicOcean {
	_callApi(endpoint: string): Promise<any>,

	translateRecipe(ingredients: string, instructions: string, version?: number): Promise<TranslatedRecipePayload>
}

enum CosmicOceanEndpoints {
	recipeTranslate = 'recipes/translate/'
}

export default <CosmicOcean>{
	async _callApi(endpoint: string, {form}: {form: any}) {
		let response = await request.post({
			uri: `${config.cosmicOceanAddress}/${endpoint}`,
			form,
		})

		return JSON.parse(response)
	},

	async translateRecipe(
		ingredients,
		instructions,
		version
	) {
		const response = await this._callApi(CosmicOceanEndpoints.recipeTranslate, {
			form: {
				ingredients,
				instructions,
				version,
			}
		})
		if (response.latest) {
			return {
				latest: true,
			}
		}

		return {
			version: response.version,
			instructions: response.instructions,
			ingredients: response.ingredients,
		}
	},
}
