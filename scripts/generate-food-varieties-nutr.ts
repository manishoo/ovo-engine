// /*
//  * generate-food-varieties-nutr.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import {getModels as getOurModels} from '../src/types/food-database-tables'
// import {main as mainConnection} from '../src/config/connections/sequelize'
// import {contentsAttribute} from '../src/types/food-database'
// import {NutrientData, NutritionalData} from '~/dao/types'
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
// // function toGrams(c: contentsAttribute) {
// // 	switch (c.origUnit) {
// // 		case 'ppm': {
// // 			return ''
// // 		}
// // 		case null: {
// // 			return ''
// // 		}
// // 		case 'g': {
// // 			return ''
// // 		}
// // 		case 'kJ': {
// // 			return ''
// // 		}
// // 		case 'kcal': {
// // 			return ''
// // 		}
// // 		case 'RE': {
// // 			return ''
// // 		}
// // 		case 'ug': {
// // 			return ''
// // 		}
// // 		case 'aTE': {
// // 			return ''
// // 		}
// // 		case 'mg': {
// // 			return ''
// // 		}
// // 		case 'NE': {
// // 			return ''
// // 		}
// // 		case 'IU': {
// // 			return ''
// // 		}
// // 		case 'ug_RAE': {
// // 			return ''
// // 		}
// // 		case 'ug_DFE': {
// // 			return ''
// // 		}
// // 		case 'mg/100 g': {
// // 			return ''
// // 		}
// // 		case 'mg/100 ml': {
// // 			return ''
// // 		}
// // 		case 'mg/100g': {
// // 			return ''
// // 		}
// // 		case 'α-TE': {
// // 			return ''
// // 		}
// // 		case 'µg': {
// // 			return ''
// // 		}
// // 		case 'ug/g': {
// // 			return ''
// // 		}
// // 		case 'uM': {
// // 			return ''
// // 		}
// // 	}
// // }
//
// async function main() {
// 	await ourModels.FoodVariety.destroy({where: {origDb: 'duke'}, force: true})
//
// 	let i = 0
// 	const count = 1000
// 	let cont = true
// 	while (cont) {
// 		console.log(`${i * count} round`)
// 		const all = await ourModels.FoodVariety.findAll({
// 			limit: count,
// 			offset: i * count,
// 			where: {origDb: {[mainConnection.Sequelize.Op.not]: 'duke'}}
// 		})
// 		if (all.length === 0) {
// 			cont = false
// 		}
// 		i++
//
// 		const allContents = await ourModels.Content.findAll({
// 			where: {
// 				origFoodId: {[mainConnection.Sequelize.Op.in]: all.map(i => i.origFoodId)},
// 				citation: {[mainConnection.Sequelize.Op.not]: 'DUKE'}
// 			}
// 		})
//
// 		for (let i = 0; i < all.length; i++) {
// 			const foodVariety = all[i]
// 			/**
// 			 * Find contents
// 			 * */
// 			const contents = allContents.filter(p => ((p.origFoodId === foodVariety.origFoodId) && (SUBFOODS.find(i => i[0] === p.citation)![1] === foodVariety.origDb)))
//
// 			function getCalorie(c: contentsAttribute) {
// 				if (c.origUnit === 'kJ') {
// 					return {
// 						content: (Number(c.origContent) / 4.184),
// 						unit: 'kcal',
// 					}
// 				} else {
// 					return {
// 						content: Number(c.origContent),
// 						unit: 'kcal',
// 					}
// 				}
// 			}
//
// 			function findContent(predicateFn: (p: contentsAttribute) => boolean) {
// 				const f = contents.find(predicateFn)
//
// 				if (f) return getContent(f)
// 			}
//
// 			function findContentById(id: number) {
// 				return findContent(p => ((p.origSourceId === String(id)) && !!p.origUnit))
// 			}
//
// 			function getContent(c: contentsAttribute): NutrientData | undefined {
// 				let content
//
// 				if (!c.origUnit) return undefined
//
// 				if (c.origContent) {
// 					content = Number(c.origContent)
// 				} else {
// 					content = ((Number(c.origMin) + Number(c.origMax)) / 2)
// 				}
//
// 				return {
// 					content,
// 					// min: c.origMin,
// 					// max: c.origMax,
// 					unit: c.origUnit,
// 				}
// 			}
//
// 			function getAverage(cs: contentsAttribute[]): NutrientData | undefined {
// 				if (!cs[0].origUnit) return undefined // FIXME please
//
// 				cs = cs.filter(p => p.origUnit === cs[0].origUnit)
//
// 				// FIXME unit if different units, return an array
// 				let minSum = 0
// 				let maxSum = 0
// 				cs.map(i => {
// 					minSum = (Number(i.origMin) || 0)
// 					maxSum = (Number(i.origMax) || 0)
// 				})
// 				const averageMin = (minSum / cs.length)
// 				const averageMax = (maxSum / cs.length)
// 				return {
// 					// min: averageMin, // average
// 					// max: averageMax, // average
// 					content: (averageMin + averageMax) / 2, // stupid! content calculation
// 					unit: cs[0].origUnit,
// 				}
// 			}
//
// 			foodVariety.nutritionalData = {
// 				// transFat: 1,
// 				get saturatedFat() {
// 					const rows = contents.filter(p => ((p.sourceId === 21594) && (!!p.origSourceId)))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						return getAverage(rows)
// 					}
//
// 					return undefined
// 				},
// 				get polyUnsaturatedFat() {
// 					const rows = contents.filter(p => ((p.sourceId === 21595) && (!!p.origSourceName && p.origSourceName.includes('poly'))))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						return getAverage(rows)
// 					}
//
// 					return undefined
// 				},
// 				get monoUnsaturatedFat() {
// 					const rows = contents.filter(p => ((p.sourceId === 21595) && (!!p.origSourceName && p.origSourceName.includes('mono'))))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						return getAverage(rows)
// 					}
//
// 					return undefined
// 				},
// 				get unsaturatedFat() {
// 					const rows = contents.filter(p => (p.sourceId === 21595))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						return getAverage(rows)
// 					}
//
// 					return undefined
// 				},
//
// 				cholesterol: findContentById(13272),
// 				sodium: findContentById(3524),
// 				potassium: findContentById(3522),
//
// 				get totalFat() {
// 					const rows = contents.filter(p => ((p.sourceId === 1) || (p.sourceId === 4)))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						return getAverage(rows)
// 					}
//
// 					return undefined
// 				},
//
// 				get totalCarbohydrates() {
// 					const rows = contents.filter(p => (p.sourceId === 3))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						switch (foodVariety.origDb) {
// 							case 'duke':
// 								return getAverage(rows)
// 							case 'dtu': {
// 								let s = rows.find(p => p.origSourceId === '0007')
// 								if (s) {
// 									return getContent(s)
// 								} else {
// 									return getContent(rows[0])
// 								}
// 							}
// 						}
// 					}
//
// 					return undefined
// 				},
//
// 				get dietaryFiber() {
// 					const rows = contents.filter(p => (p.sourceId === 5))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						switch (foodVariety.origDb) {
// 							case 'dtu': {
// 								let s = rows.find(p => p.origSourceId === '0010')
// 								if (s) {
// 									return getContent(s)
// 								} else {
// 									return getContent(rows[0])
// 								}
// 							}
// 						}
// 					}
//
// 					return undefined
// 				},
//
// 				sugars: findContent(p => (p.sourceId === 3716)),
//
// 				get protein() {
// 					const rows = contents.filter(p => (p.sourceId === 2))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						switch (foodVariety.origDb) {
// 							case 'duke':
// 								return getAverage(rows)
// 							case 'dtu': {
// 								let s = rows.find(p => p.origSourceId === '0001')
// 								if (s) {
// 									return getContent(s)
// 								} else {
// 									return getContent(rows[0])
// 								}
// 							}
// 							case 'usda': {
// 								let s = rows.find(p => p.origSourceId === '203')
// 								if (s) {
// 									return getContent(s)
// 								} else {
// 									return getContent(rows[0])
// 								}
// 							}
// 						}
// 					}
//
// 					return undefined
// 				},
//
// 				/**
// 				 * VITAMINS
// 				 * */
// 				get vitaminC() {
// 					const rows = contents.filter(p => ((p.sourceId === 1224) && !!p.origSourceId))
//
// 					if (rows.length === 1) {
// 						return getContent(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						switch (foodVariety.origDb) {
// 							case 'duke':
// 								return getAverage(rows)
// 							case 'dtu': {
// 								let s = rows.find(p => p.origSourceId === '0050')
// 								if (s) {
// 									return getContent(s)
// 								} else {
// 									return getContent(rows[0])
// 								}
// 							}
// 						}
// 					}
//
// 					return undefined
// 				},
// 				vitaminA: findContentById(13831),
// 				calcium: findContentById(3514),
// 				iron: findContentById(16258),
//
// 				get calories() {
// 					const rows = contents.filter(p => (p.sourceId === 38))
//
// 					if (rows.length === 1) {
// 						return getCalorie(rows[0])
// 					}
//
// 					if (rows.length > 1) {
// 						const f = rows.find(p => p.origUnit === 'kcal')
// 						if (f) {
// 							return getCalorie(f)
// 						} else {
// 							return getCalorie(rows[0])
// 						}
// 					}
//
// 					return {
// 						content: (
// 							((this.totalFat ? this.totalFat.content : 0) * 9) +
// 							((this.totalCarbohydrates ? this.totalCarbohydrates.content : 0) * 4) +
// 							((this.protein ? this.protein.content : 0) * 4)
// 						),
// 						unit: 'kcal'
// 					}
// 				},
// 				get caloriesFromFat() {
// 					return {
// 						content: ((this.totalFat ? this.totalFat.content : 0) * 9),
// 						unit: 'kcal',
// 					}
// 				},
// 			}
// 			await foodVariety.save()
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
