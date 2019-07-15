/*
 * USDA-food-reports.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/*
import request from 'request-promise'
import IngredientModel, {Ingredient, Nutrient} from 'models/ingredient.model'
import PromisePool from 'es6-promise-pool'

export async function init() {
	let count = 3300
	let ij = 0
	let run = true

	async function promiseProducer() {
		console.log('Cluster ', count)
		let c = count;
		count++;
		let ingredients = await IngredientModel.find({}, {skip: count * 25, limit: 25})

		ingredients = ingredients.filter(i => i.foodData && i.foodData.ndbno)

		console.log(c, ' getting reports')
		let reportResponse = await request.get({
			url: `https://api.nal.usda.gov/ndb/V2/reports/`,
			qs: {
				ndbno: <string[]>ingredients.map(i => i.foodData.ndbno),
				offset: c * 25,
				type: 'f',
				format: 'json',
				api_key: 'CkhKMhvbeNEaArbWCpWmU6yOUHLqKOkj71y32rrn',
			},
			useQuerystring: true,
		})
			.catch(e => {
				console.error(e)
				throw (e)
			})

		try {
			reportResponse = JSON.parse(reportResponse)
		} catch (e) {
			console.error(e)
			throw e
		}

		if (reportResponse.foods.length === 0) {
			run = false;
			return null
		}

		await Promise.all(reportResponse.foods.map(async (item) => {
			if (item.food.ing) {
				const ings = item.food.ing.desc.split(',').map(i => i.trim())

				await Promise.all(ings.map((item) => {
					const ingred = <Ingredient>{name: item}
					return IngredientModel.findOrCreate(ingred)
				}))
			}

			console.log(c, ' updating ingredient', ij)
			ij++;

			if (item.food.type === 'f') {
				await IngredientModel.update({'foodData.ndbno': item.food.desc.ndbno}, <Ingredient>{
					name: item.food.desc.name,
					shortDescription: item.food.desc.sd,
					category: item.food.desc.fg,
					manufacturer: item.food.desc.manu ? item.food.desc.manu : undefined,
					// subIngredients: item.food.ing ? item.food.ing.desc : undefined,
					nutrients: item.food.nutrients.map((nutrient) => <Nutrient>({
						name: nutrient.name,
						group: nutrient.group,
						unit: nutrient.unit,
						value: nutrient.value,
						derivation: nutrient.derivation,
					})),
					foodData: {
						ndbno: item.food.desc.ndbno,
						...item.food
					},
				})
			} else {
				await IngredientModel.update({'foodData.ndbno': item.food.desc.ndbno}, <Ingredient>{
					name: item.food.desc.name,
					manufacturer: item.food.desc.manu ? item.food.desc.manu : undefined,
					// subIngredients: item.food.ing ? item.food.ing.desc : undefined,
					nutrients: item.food.nutrients.map((nutrient) => <Nutrient>({
						name: nutrient.name,
						group: nutrient.group,
						unit: nutrient.unit,
						value: nutrient.value,
						derivation: nutrient.derivation,
					})),
					foodData: {
						ndbno: item.food.desc.ndbno,
						...item.food
					},
				})
			}
		}))
	}

	const pool = new PromisePool(promiseProducer, 2)
	await pool.start()
}

init()
	.then((s) => console.log('.'))
*/
