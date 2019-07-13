/*
 * food.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {FOOD_TYPES, LANGUAGE_CODES} from '~/constants/enums'
import {Content, Food, FoodGroup, Weight, Translation, FoodVariety} from '@dao/models'
import {main, Sequelize} from '@dao/connections/sequelize'
import {
	Food as FoodO,
	FoodInput,
	FoodTranslationO, NameAndId,
	NutritionalData,
	Weight as WeightType
} from '@dao/types'
import uuid from 'uuid/v1'
import {processUpload} from '@utils/upload/utils'
import shortid from 'shortid'
import WeightRepository from '@dao/repositories/weight.repository'
import {
	contentsAttribute,
	foodGroupInstance,
	foodsInstance, foodVarietyInstance, translationInstance,
	weightInstance,
} from '@dao/models/foods/db'
import {setImageUrl} from '@utils/imageUrlSetter'

interface FoodFind {
	query?: string,
	limit?: number,
	offset?: number,
	lang: LANGUAGE_CODES,
	shouldIncludeNutrients?: boolean
}

interface FoodTranslationList {
	limit?: number,
	offset?: number,
	sourceLang: LANGUAGE_CODES,
	targetLang: LANGUAGE_CODES,
	query?: string,
	fgid?: string,
	isVerified?: boolean,
}

interface FoodCreateInput {
	foodGroupId: string
	name: string
	description?: string
	imageUrl?: string
	nutrients: { id: string, value: number }[]
	proFactor?: number
	fatFactor?: number
	choFactor?: number
	nFactor?: number
	sci_name?: string
	refuse?: string
	survey?: string
	manufacturerName?: string
}

async function transformWeights(weights: weightInstance[], lang: LANGUAGE_CODES) {
	return Promise.all((weights || []).map(async weight => {
		let description
		const wFound = weight.translations && weight.translations.find(p => p.lang === lang)
		if (wFound) {
			description = wFound.text
		}

		return {
			id: weight.publicId,
			description,
			amount: weight.amount,
			gramWeight: weight.gmWgt,
			seq: weight.seq,
			unit: weight.unit,
		}
	}))
}

async function getGroupName(foodGroup: foodGroupInstance, lang: LANGUAGE_CODES): Promise<{ name: string, id: string }[]> {
	function getTranslation(fg: foodGroupInstance): string {
		let name = ''
		const tr = fg.translations.find(p => p.lang === lang)

		if (tr) {
			name = tr.text
		}

		return name
	}

	const groupArray: { name: string, id: string }[] = []

	groupArray.push({
		name: getTranslation(foodGroup),
		id: foodGroup.publicId,
	})
	let parent = foodGroup.parentId
	while (parent) {
		// get the parent and add it to array
		const p = await FoodGroup.findByPk(parent, {
			include: [includeFoodGroupTranslations()]
		})
		if (!p) throw new Error('invalid food group')

		groupArray.push({
			name: getTranslation(p),
			id: p.publicId,
		})
		parent = p.parentId
	}

	return groupArray
}

function includeFoodGroup() {
	return {
		model: FoodGroup,
		required: true,
		include: [
			// {model: FoodGroupTr, required: true, as: 'translations'}
			includeFoodGroupTranslations()
		],
		as: 'foodGroup',
	}
}

function includeWeights(foodSource?: string) {
	let where: any = undefined
	if (foodSource) {
		where = {foodSource}
	}
	return {
		model: Weight,
		include: [
			{
				model: Translation,
				required: true,
				as: 'translations',
				where: {sourceType: 'weight'},
			}
		],
		as: 'weights',
		where,
	}
}

function includeContentsShallow() {
	return {
		model: Content,
		required: true,
		as: 'contents',
		where: {
			citation: 'USDA',
			// sourceType: 'Nutrient',
			// origSourceName: 'Energy',
			// origUnit: 'kcal',
		},
		// separate: true,
		// include: [{
		// 	model: Translation,
		// 	required: true,
		// 	as: 'translations',
		// 	where: {
		// 		field: 'common_name', // FIXME
		// 		sourceType: 'food_usda', // FIXME
		// 	},
		// }],
	}
}

function includeFoodTranslations() {
	return {
		model: Translation,
		required: true,
		as: 'translations',
		where: {sourceType: 'food'},
	}
}

function includeFoodGroupTranslations() {
	return {
		model: Translation,
		required: true,
		as: 'translations',
		where: {sourceType: 'food_group'},
	}
}

function getFoodTranslation(translations: translationInstance[], lang: LANGUAGE_CODES) {
	let name = ''
	let description = ''

	const foodTrs = translations.filter(p => p.lang === lang)

	const ourLangFoodTrs = foodTrs.filter(p => p.lang === lang)
	const nameFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'name')
	const descFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'description')

	if ((nameFieldIndex !== undefined) && ourLangFoodTrs[nameFieldIndex]) {
		name = ourLangFoodTrs[nameFieldIndex].text
	}

	if ((descFieldIndex !== undefined) && ourLangFoodTrs[descFieldIndex]) {
		description = ourLangFoodTrs[descFieldIndex].text
	}

	return {
		name,
		description,
	}
}

/*
function getNutrientsFromContents(contents: contentsAttribute[]): NutritionalData {
	// '13:0'
	// '14:1'
	// '15:1'
	// '16:1 c'
	// '16:1 t'
	// '16:1 undifferentiated'
	// '17:1'
	// '18:1 c'
	// '18:1 t'
	// '18:1 undifferentiated'
	// '18:2 CLAs'
	// '18:2 i'
	// '18:2 t not further defined'
	// '18:2 t,t'
	// '18:2 undifferentiated'
	// '18:3 undifferentiated'
	// '18:3i'
	// '18:4'
	// '20:1'
	// '20:2 n-6 c,c'
	// '20:3 n-3'
	// '20:3 n-6'
	// '20:3 undifferentiated'
	// '20:4 undifferentiated'
	// '21:5'
	// '22:0'
	// '22:1 c'
	// '22:1 t'
	// '22:1 undifferentiated'
	// '22:4'
	// '22:5 n-3'
	// '24:1 c'
	//
	// 'Carbohydrate'
	// 'Energy'
	// 'Fat'
	// 'Fatty acids'
	// 'Fiber (dietary)'
	// 'Proteins'

	function find(predicate: (p: any) => boolean): number | undefined {
		const r = contents.find(predicate)
		if (r) {
			return r.origContent
		}

		return undefined
	}

	// console.log('contents', contents.map(c => c.origSourceName))
	return {
		energyKcal: find(p => ((p.origSourceName.toLowerCase() === 'energy') && (p.origUnit === 'kcal'))),
		energyKj: find(p => ((p.origSourceName.toLowerCase() === 'energy') && (p.origUnit === 'kJ'))),
		protein: find(p => (p.origSourceName.toLowerCase() === 'protein')),
		fat: find(p => (p.origSourceName.toLowerCase() === 'total lipid (fat)')),
		fiber: find(p => (p.origSourceName.toLowerCase() === 'fiber, total dietary')),
		carbohydrate: find(p => (p.origSourceName.toLowerCase() === 'carbohydrate, by difference')),
		water: find(p => (p.origSourceName.toLowerCase() === 'water')),
	}
}
*/

async function transformFood(food: foodsInstance, lang: LANGUAGE_CODES, withNutrients: boolean, withWeights: boolean): Promise<FoodO> {
	if (!food.foodGroup) throw new Error('food group empty')

	return {
		id: food.publicId,
		name: getFoodTranslation(food.translations, lang).name,
		description: getFoodTranslation(food.translations, lang).description,
		foodGroup: await getGroupName(food.foodGroup, lang),
		image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined,
		// nutrients: withNutrients ? await transformNutrients(food.contents, lang) : undefined,
		weights: withWeights ? await transformWeights(food.weights || [], lang) : undefined,
	}
}

async function transformFoodVarietyTranslation(translation: translationInstance, lang: LANGUAGE_CODES, withNutrients: boolean, withWeights: boolean): Promise<FoodO> {
	const foodVariety = translation.foodVariety
	// const food = translation.foodVariety.food

	let weights: WeightType[] = []
	if (withWeights && foodVariety.weights) {
		weights = foodVariety.weights.map(w => {
			const foundTr = w.translations.find(p => p.lang === lang)
			if (!foundTr) throw new Error('no weight found') //FIXME better

			return {
				description: foundTr.text,
				id: w.publicId,
				unit: w.unit,
				amount: w.amount,
				gramWeight: w.gmWgt,
				seq: w.seq,
			}
		})
	}

	return {
		id: foodVariety.publicId,
		name: translation.text,
		// foodGroup: await getGroupName(food.foodGroup, lang),
		// image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined,
		nutrients: withNutrients ? foodVariety.nutritionalData : undefined,
		weights,
	}
}

async function transformFoodVariety(foodVariety: foodVarietyInstance, lang: LANGUAGE_CODES): Promise<FoodO> {
	const food = foodVariety.food

	console.log('foodVariety.weights', foodVariety.weights)

	let weights: WeightType[] = []
	if (foodVariety.weights) {
		weights = foodVariety.weights.map(w => {
			const foundTr = w.translations.find(p => p.lang === lang)
			if (!foundTr) throw new Error('no weight found') //FIXME better

			return {
				description: foundTr.text,
				id: w.publicId,
				unit: w.unit,
				amount: w.amount,
				gramWeight: w.gmWgt,
				seq: w.seq,
			}
		})
	}

	const translation = foodVariety.translations[0]
	if (!translation) throw new Error('translation not found')

	return {
		id: foodVariety.publicId,
		name: translation.text,
		foodGroup: await getGroupName(food.foodGroup, lang),
		image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, true, food.id)} : undefined, // FIXME setImageUrl
		thumbnail: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined, // FIXME setImageUrl
		nutrients: foodVariety.nutritionalData,
		weights,
	}
}


export default {
	async find({query, limit, offset = 0, lang, shouldIncludeNutrients = true}: FoodFind): Promise<{ foods: FoodO[], totalCount: number }> {
		let where: any = {
			sourceType: 'food',
			field: 'name'
		}
		if (query) {
			where = {
				...where,
				text: {$like: `%${query}%`},
				lang,
			}
		}

		const {rows: foodVarietyTranslations, count} = await Translation.findAndCountAll({
			where,
			limit,
			offset,

			// include: [
			// 	{
			// 		model: Content,
			// 		required: true,
			// 		as: 'contents',
			// 		// include: [
			// 		// 	{
			// 		// 		model: Food,
			// 		// 		required: true,
			// 		// 		as: 'food',
			// 		// 		include: [
			// 		// 			includeFoodGroup()
			// 		// 		],
			// 		// 	}
			// 		// ],
			// 	}
			// ],
		})

		return {
			totalCount: count,
			foods: await Promise.all(foodVarietyTranslations.map(async f => transformFoodVarietyTranslation(f, lang, shouldIncludeNutrients, true))),
		}
	},
	async findFoodVariety({query, limit, offset = 0, lang, shouldIncludeNutrients = true}: FoodFind): Promise<{ foods: FoodO[], totalCount: number }> {
		let where: any = {
			sourceType: 'food_variety',
			field: 'name'
		}
		if (query) {
			where = {
				...where,
				text: {$like: `%${query}%`},
				lang,
			}
		}

		const {rows: foodVarietyTranslations, count} = await Translation.findAndCountAll({
			where,
			limit,
			offset,
			include: [
				{
					model: FoodVariety,
					required: true,
					as: 'foodVariety',
					// include: [
					// 	{
					// 		model: Food,
					// 		required: true,
					// 		as: 'food',
					// 		include: [
					// 			includeFoodGroup()
					// 		],
					// 	},
					// 	includeWeights()
					// ],
				},
			],
		})

		return {
			totalCount: count,
			foods: await Promise.all(foodVarietyTranslations.map(async f => transformFoodVarietyTranslation(f, lang, shouldIncludeNutrients, false))),
		}
	},
	async findFoodVarietiesWithIds(publicIds: string[], lang: LANGUAGE_CODES) {
		const foodVarieties = await FoodVariety.findAll({
			where: {
				publicId: {[Sequelize.Op.in]: publicIds}
			},
			include: [
				{
					model: Translation,
					required: true,
					as: 'translations',
				},
				{
					model: Food,
					required: true,
					as: 'food',
					include: [
						includeFoodGroup()
					],
				},
				includeWeights()
			]
		})

		return Promise.all(foodVarieties.map(f => transformFoodVariety(f, lang)))
	},
	async findById(id: string, lang: LANGUAGE_CODES): Promise<FoodO> {
		const food = await Food.findByPk(id, {
			include: [
				includeFoodTranslations(),
				includeFoodGroup(),
				// includeWeights(),
				includeContentsShallow(),
				// includeContentsFull(),
			],
		})
		if (!food) throw new Error(`food not found. id: ${id}`)

		const contentTranslations = await Translation.findAll({
			where: {
				[Sequelize.Op.and]: [{
					sourceId: {
						[Sequelize.Op.in]: food.contents.map(content => String(content.origFoodId))
					}
				}, {
					field: 'common_name',
				}, {
					sourceType: 'food_usda',
				}]
			},
		})

		food.contents = food.contents.map(content => {
			content.translations = contentTranslations.filter(i => i.sourceId === content.origFoodId)
			return content
		})

		return transformFood(food, lang, true, true)
	},
	async findFoodByPublicId(publicId: string, lang: LANGUAGE_CODES): Promise<FoodO> {
		const food = await Food.findOne({where: {publicId}})
		if (!food) throw new Error(`food not found. publicId: ${publicId}`)

		return this.findById(food.id, lang)
	},
	async findFoodVarietyByPublicId(publicId: string, lang: LANGUAGE_CODES): Promise<FoodO> {
		const foodVariety = await FoodVariety.findOne({
			where: {publicId},
			include: [
				{
					model: Translation,
					as: 'translations',
					required: true,
					where: {
						lang,
						sourceType: 'food_variety'
					},
				},
				{
					model: Food,
					required: true,
					as: 'food',
					include: [
						includeFoodGroup()
					],
				},
				includeWeights()
			],
		})

		if (!foodVariety) throw new Error('not found') // FIXME 404

		return transformFoodVariety(foodVariety, lang)
	},
	async removeById(id: string) {
		const numberOfDestroyedElements = await Food.destroy({
			where: {
				pid: id,
			}
		})

		return {
			id,
			deleted: numberOfDestroyedElements === 1,
		}
	},
	async create(data: FoodCreateInput, lang: LANGUAGE_CODES) {
		// check whether food group exists
		const fg = await FoodGroup.findOne({
			where: {publicId: data.foodGroupId}, include: [includeFoodTranslations()]
		})
		if (!fg) throw new Error('food group doesn\'t exist')

		/**
		 * Create food
		 * */
		return main.transaction(t => {
			// @ts-ignore
			return Food.create({
				publicId: uuid(),
				origName: data.name,
				foodType: FOOD_TYPES.unknown,
				foodGroupId: fg.id,
				pictureFileName: data.imageUrl,
			}, {transaction: t})
				.then((food: foodsInstance) => {
					/**
					 * Create food translation
					 * */
					const translations = [
						{
							text: data.name,
							field: 'name',
							lang,
							sourceId: String(food.id),
							sourceType: 'food',
						}
					]

					if (data.description) {
						translations.push({
							text: data.description,
							field: 'description',
							lang,
							sourceId: String(food.id),
							sourceType: 'food',
						})
					}

					return Translation.bulkCreate(translations, {transaction: t})
						.then(async (foodTrs: translationInstance[]) => {
							/**
							 * Create nutrient data fields
							 * */
							let name = ''
							let description = ''

							const ourLangFoodTrs = foodTrs.filter(p => p.lang === lang)
							const nameFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'name')
							const descFieldIndex = ourLangFoodTrs.findIndex(p => p.field == 'description')

							if (nameFieldIndex && ourLangFoodTrs[nameFieldIndex]) {
								name = ourLangFoodTrs[nameFieldIndex].text
							}

							if (descFieldIndex && ourLangFoodTrs[descFieldIndex]) {
								description = ourLangFoodTrs[descFieldIndex].text
							}

							// check whether nutrients are correct
							return {
								id: food.publicId,
								name,
								description,
								foodGroup: await getGroupName(fg, lang),
								image: food.pictureFileName ? setImageUrl(food.pictureFileName, false, food.id) : undefined,
								// nutrients: transformNutrients(nutrientData, lang),
							}
							// FIXME add nutrients
							// return Nutrient.findAll({
							// 	where: {
							// 		nid: {
							// 			$in: data.nutrients.map(i => i.id)
							// 		}
							// 	}
							// })
							// 	.then(nutrients => {
							// 		if (nutrients.length !== data.nutrients.length) {
							// 			throw new Error('nutrients aren\'t right')
							// 		}
							//
							// 		return NutrientData.bulkCreate(data.nutrients.map(n => ({
							// 			value: n.value,
							// 			nid: n.id,
							// 			fid: food.fid,
							// 		})), {transaction: t})
							// 			.then(nutrientData => {
							// 				/**
							// 				 * TODO Manage source
							// 				 * */
							//
							// 				return {
							// 					id: food.fid,
							// 					name: foodTr.name,
							// 					description: foodTr.description,
							// 					foodGroup: groupName,
							// 					image: food.image_url,
							// 					nutrients: transformNutrients(nutrientData, lang),
							// 				}
							// 			})
							// 	})
						})
				})
		})
	},
	async listForTranslation({limit = 25, offset = 0, sourceLang, targetLang, query, fgid, isVerified}: FoodTranslationList): Promise<{ foods: FoodTranslationO[], totalCount: number }> {
		let where: any = {}
		if (fgid) {
			where = {
				fgid,
			}
		}
		if (query) {
			const foodTrs = await Translation.findAll({
				where: {
					[Sequelize.Op.or]: [{
						text: {[Sequelize.Op.regexp]: `^${query}`},
						field: 'name',
					}, {
						text: {[Sequelize.Op.regexp]: `^${query}`},
						field: 'description',
					}],
					sourceType: 'food',
				},
				limit,
			})
			if (Object.keys(where).length === 0) {
				where = {
					id: {$in: foodTrs.map(f => f.id)}
				}
			} else {
				where.id = {$in: foodTrs.map(f => f.id)}
			}
		}

		if (isVerified !== undefined) {
			if (Object.keys(where).length === 0) {
				where = {
					is_verified: isVerified
				}
			} else {
				where.is_verified = isVerified
			}
		}

		const {rows: foods, count: totalCount} = await Food.findAndCountAll({
			benchmark: true,
			where,
			limit,
			offset,
			include: [
				includeFoodGroup(),
				// includeWeights(),
				// {
				// 	model: FoodTr,
				// 	required: true,
				// 	as: 'translations'
				// },
			]
		})

		return {
			totalCount,
			foods: await Promise.all(foods.map(async (food) => {
				const weights = await food.getWeights()

				const tr = await food.getTranslations()
				const translations: { lang: LANGUAGE_CODES, name: string, description?: string }[] = []
				tr.map(t => {
					if (translations.find(p => p.lang === t.lang)) {
						const tr = translations.find(p => p.lang === t.lang)
						// @ts-ignore
						tr[t.field] = t.text
					} else {
						// @ts-ignore
						translations.push({
							lang: <LANGUAGE_CODES>t.lang,
							[t.field]: t.text,
						})
					}
				})

				return {
					id: food.publicId,
					isVerified: food.isVerified,
					foodGroup: await getGroupName(food.foodGroup, LANGUAGE_CODES.en),
					image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined,
					translations,
					weights: /* FIXME weights ? await Promise.all(weights.map(async weight => {
						if (!weight.getTranslations) throw new Error('no fw tr')
						const trs = await weight.getTranslations()

						return {
							id: weight.publicId,
							translations: trs.map(tr => ({
								lang: <LANGUAGE_CODES>tr.lang,
								description: tr.text,
							})),
							amount: weight.amount,
							gramWeight: weight.gmWgt,
							seq: weight.seq,
							unit: weight.unit,
						}
					})) : */[],
				}
			})),
		}
	},

	// FIXME
	async submitTranslation(id: string, toLang: LANGUAGE_CODES, name: string): Promise<{ id: any, lang: LANGUAGE_CODES, name: string }> {
		const food = await Food.findOne({where: {publicId: id}})
		if (!food) throw new Error('invalid food')

		const ftrs = await Translation.findAll({where: {sourceId: food.id, sourceType: 'food', lang: toLang}})

		if (ftrs) {
			if (ftrs.find(p => p.field === 'name')) {
				const ftr = ftrs.find(p => p.field === 'name')
				ftr!.text = name
				await ftr!.save()
			}
			// if (description && ftrs.find(p => p.field === 'description')) {
			// 	const ftr = ftrs.find(p => p.field === 'description')
			// 	ftr!.text = description
			// 	await ftr!.save()
			// }
		} else {
			const translations = [
				{
					sourceType: 'food',
					sourceId: String(food.id),
					lang: toLang,
					text: name,
					field: 'name',
				}
			]

			// if (description) {
			// 	translations.push({
			// 		sourceType: 'food',
			// 		sourceId: String(food.id),
			// 		lang: toLang,
			// 		text: description,
			// 		field: 'description',
			// 	})
			// }
			await Translation.bulkCreate(translations)
		}

		// const tr = await FoodTr.findOne({where: {foodId: food.id, lang: toLang}})
		// if (!tr) throw new Error('no tr')

		return {
			id,
			lang: toLang,
			// description: description,
			name,
		}
	},
	async updateFood(id: string, lang: LANGUAGE_CODES, translations: FoodInput[], weights: WeightType[], fgid: string, isVerified: boolean, image: any): Promise<FoodTranslationO> {
		const food = await Food.findByPk(id/*, {
			include: [
				includeWeights(),
			],
		}*/)
		if (!food) throw new Error('not found')

		const tr = await Promise.all(translations.map(async (tr) => {
			return this.submitTranslation(id, tr.lang, tr.name, tr.description)
		}))

		const fg = await FoodGroup.findByPk(fgid)
		if (!fg) throw new Error('fg not valid')
		food.foodGroupId = fg.id
		food.isVerified = isVerified
		let image_url

		if (image) {
			let name
			if (food.getTranslations) {
				const trs = await food.getTranslations()
				let found = trs.find(p => (p.lang === LANGUAGE_CODES.en) && (p.field === 'name'))
				if (found) {
					name = found.text
				}
				image_url = await processUpload(image, `${name}-${shortid.generate()}`, 'foods')
			}
		}
		food.pictureFileName = image_url
		await food.save()

		let weightsOut: WeightType[] = []
		/**
		 * Weights
		 * */
		if (food.weights) {
			/**
			 * Check for deletion and update
			 * */
			let ws = await Promise.all(food.weights.map(async weight => {
				const foundWeight = weights.find(w => w.id === weight.publicId)

				if (foundWeight) {
					// update
					return WeightRepository.update(weight.id!, foundWeight)
				} else {
					// delete
					await WeightRepository.delete(weight.id!)
				}
			}))
			ws = ws.filter(Boolean)

			/**
			 * Check for addition
			 * */
			let ws2 = await Promise.all(weights.map(async weight => {
				if (food.weights) {
					const foundWeight = food.weights.find(p => p.publicId === weight.id)

					if (!foundWeight) {
						return WeightRepository.create(food.id, weight)
					}
				}
			}))
			ws2 = ws2.filter(Boolean)

			// @ts-ignore
			weightsOut.push(...ws, ...ws2)
		}


		return {
			id: food.publicId,
			isVerified: food.isVerified,
			foodGroup: await getGroupName(fg, lang),
			image: food.pictureFileName ? {url: setImageUrl(food.pictureFileName, false, food.id)} : undefined,
			translations: tr.map(i => ({
				name: i.name,
				description: i.description,
				lang: <LANGUAGE_CODES>i.lang,
			})),
			// source: {
			// 	name: sourceTr.name,
			// 	description: sourceTr.description,
			// 	lang: sourceLang
			// },
			// target,
			// weights: []

			weights: weightsOut,
			// weights: food.weights ? await Promise.all(food.weights.map(async weight => {
			// 	if (!weight.getTranslations) throw new Error('no fw tr')
			// 	const translations = await weight.getTranslations()
			// 	let description = ''
			// 	const wtr = translations.find(p => p.lang === lang)
			// 	if (wtr) {
			// 		description = wtr.description
			// 	}
			// 	return {
			// 		id: weight.wid,
			// 		description,
			// 		amount: weight.amount,
			// 		gramWeight: weight.gm_wgt,
			// 		seq: weight.seq,
			// 	}
			// })) : [],
		}
	},
	async getFoodGroups(lang: LANGUAGE_CODES): Promise<NameAndId[]> {
		const foodGroups = await FoodGroup.findAll({
			where: {parentId: null},
			include: [includeFoodGroupTranslations()]
		})
		return foodGroups.map(fg => {
			if (!fg.translations) throw new Error('fg not found')
			const fgTr = fg.translations.find(p => p.lang === lang)
			if (!fgTr) throw new Error('tr not found')

			return {
				id: fg.publicId,
				name: fgTr.text,
			}
		})
	},
}
