// /*
//  * create-food-varieties.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import {getModels as getOurModels} from '../src/types/food-database-tables'
// import {main as mainConnection} from '../src/config/connections/sequelize'
// import {foodVarietyAttribute, translationAttribute} from '../src/types/food-database'
// import {LANGUAGE_CODES} from '~/constants/enums'
// // import {Translation} from '~/dao/models'
// import _ from 'lodash'
// import uuid from 'uuid/v1'
//
// const ourModels = getOurModels(mainConnection)
//
// const SUBFOODS = [
// 	['DUKE', 'duke'],
// 	['DTU', 'dtu'],
// 	['USDA', 'usda'],
// 	['PHENOL EXPLORER', 'phenol'],
// 	['KNAPSACK', 'knapsack'],
// 	['DFC CODES', 'dfc'],
// 	['MANUAL', 'manual'],
// 	['Wikipedia', 'wikipedia'],
// 	['SELFNutritionData', 'selfndata'],
// 	['Nutrition and You', 'n&u'],
// 	['Edible Medicinal And Non-Medicinal Plants: Volume 6, Fruits. By T. K. Lim', 'tklim'],
// 	['The World Healthiest Foods', 'twhf'],
// 	['DurableHealth', 'durablehealth'],
// 	['Richard G. St-Pierre. Quality & Nutritive Value of Saskatoon Fruit. January 2006', 'rgstpierre'],
// 	['All-Creatures', 'allcreatures'],
// 	['Tunde Jurikova  et al. Evaluation of Polyphenolic Profile and Nutritional Value of Non-Traditional Fruit Species in the Czech Republic — A Comparative Study. Molecules 2012, 17(8), 8968-8981; doi:10.3390/molecules17088968', 'tundej'],
// 	['The earth of India', 'teoindia'],
// 	['CalorieSlism', 'calorieslism'],
// ]
//
// const allFoodVarieties: foodVarietyAttribute[] = []
//
// async function main() {
// 	await ourModels.Translation.destroy({
// 		where: {
// 			field: 'common_name'
// 		}
// 	})
// 	await ourModels.FoodVariety.sync({force: true})
//
// 	{
// 		console.log('Traversing Contents...')
// 		/**
// 		 * Get contents 10000 at a time and if we haven't already added it's food variety, add it.
// 		 * */
// 		let i = 0
// 		const count = 10000
// 		let cont = true
// 		while (cont) {
// 			console.log(`${i * count} round`)
// 			const all = await ourModels.Content.findAll({limit: count, offset: i * count})
// 			if (all.length === 0) {
// 				cont = false
// 			}
// 			i++
//
// 			const foodVarieties: foodVarietyAttribute[] = []
//
// 			for (let i = 0; i < all.length; i++) {
// 				const content = all[i]
//
// 				// find abbr
// 				const found = SUBFOODS.find(p => p[0] === content.citation)
// 				if (!found) console.log(`NOT FOUND FOR ${content.citation}`)
//
// 				if (found && content.origFoodCommonName && content.origFoodId) {
// 					const origCitationAbbr = found[1]
//
// 					const hast = _.find(allFoodVarieties, p => ((p.origFoodId === content.origFoodId) && (String(p.origDb) === origCitationAbbr)))
//
// 					if (!hast) {
// 						const fv = {
// 							foodId: content.foodId,
// 							origDb: origCitationAbbr,
// 							origFoodId: content.origFoodId,
// 							origFoodName: content.origFoodCommonName,
// 							publicId: uuid(),
// 							nutritionalData: {},
// 						}
// 						foodVarieties.push(fv)
// 						allFoodVarieties.push(fv)
// 					}
// 				}
// 			}
// 			// console.log(translations.length)
// 			// {
// 			// 	translations.filter(tr => translations.find(p => (
// 			// 		(p.sourceType === tr.sourceType) &&
// 			// 		(p.sourceId === tr.sourceId)
// 			// 	)))
// 			// }
// 			// const trs = translations.filter(tr => !translations.find(p => (
// 			// 	(p.sourceType === tr.sourceType) &&
// 			// 	(p.sourceId === tr.sourceId)
// 			// )))
// 			const savedFoodVarieties = await ourModels.FoodVariety.bulkCreate(foodVarieties)
// 			await ourModels.Translation.bulkCreate(savedFoodVarieties.map(fv => ({
// 				text: fv.origFoodName,
// 				lang: LANGUAGE_CODES.en,
// 				sourceId: String(fv.id!),
// 				sourceType: 'food_variety',
// 				field: 'name',
// 			})))
// 			// totalTranslations.push(...translations)
// 		}
// 	}
// }
//
// main()
// 	.then(() => {
// 		console.log('Done')
// 		process.exit(0)
// 	})
// 	.catch(e => {
// 		console.error(e)
// 		process.exit(1)
// 	})
