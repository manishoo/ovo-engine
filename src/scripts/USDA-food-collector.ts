/*
 * USDA-food-collector.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/*
import request from 'request-promise'
import IngredientRepo, { Ingredient } from 'models/ingredient.model'

export async function init() {
	const url = 'https://api.nal.usda.gov/ndb/list'

	let count = 165
	let run = true
	while (run) {
		try {
			console.log('getting', count)
			let response = await request.get({
				url,
				qs: {
					max: 1500,
					offset: count * 1500,
					sort: 'n',
					lt: 'f',
					format: 'json',
					api_key: 'CkhKMhvbeNEaArbWCpWmU6yOUHLqKOkj71y32rrn',
				}
			})
			response = JSON.parse(response);
			// console.log(typeof response)
			if (response.list.item.length === 0) {
				run = false
			}
			console.log('saving', count)
			for (let i = 0; i < response.list.item.length; i++) {
				await IngredientRepo.findOrCreate(<Ingredient>{
					name: <string>response.list.item[i].name,
					foodData: <any>{
						ndbno: response.list.item[i].id,
					},
				})
				console.log('saved!', count)
			}
			count++;
		} catch (e) {
			console.error(e)
		}
	}

}

init()
	.then((s) => console.log('.'))
*/
