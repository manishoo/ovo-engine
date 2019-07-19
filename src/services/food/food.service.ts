/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { main } from '@Config/connections/sequelize'
import { FoodGroupModel, FoodModel, FoodVarietyModel, TranslationModel } from '@Models'
import { transformFoodVarietyTranslation } from '@Services/food/transformers/food-variety-translation.transformer'
import { transformFoodVariety } from '@Services/food/transformers/food-variety.transformer'
import { transformFood } from '@Services/food/transformers/food.transformer'
import { getGroupName } from '@Services/food/utils/get-group-name'
import {
	includeContentsShallow,
	includeFoodGroup,
	includeFoodGroupTranslations,
	includeFoodTranslations,
	includeWeights
} from '@Services/food/utils/includes'
import RecipeService from '@Services/recipe/recipe.service'
import UserService from '@Services/user/user.service'
import WeightService from '@Services/weight/weight.service'
import { LANGUAGE_CODES, NameAndId } from '@Types/common'
import { MealItem } from '@Types/eating'
import {
	Food,
	FOOD_TYPES,
	FoodCreateInput,
	FoodFind,
	FoodInput,
	FoodTranslationList,
	FoodTranslationO
} from '@Types/food'
import { foodsInstance, translationInstance } from '@Types/food-database'
import { MealPlan } from '@Types/meal-plan'
import { MEAL_ITEM_TYPES } from '@Types/meals'
import { Recipe } from '@Types/recipe'
import { Weight } from '@Types/weight'
import { setImageUrl } from '@Utils/image-url-setter'
import { getEditDistance } from '@Utils/levenshtein'
import { processUpload } from '@Utils/upload/utils'
import Sequelize, { Transaction } from 'sequelize'
import shortid from 'shortid'
import { Service } from 'typedi'
import uuid from 'uuid/v1'
import MealPlanner from './utils/meal-planner'


@Service()
export default class FoodService {
	constructor(
		// service injection
		private readonly userService: UserService,
		private readonly recipeService: RecipeService,
		private readonly weightService: WeightService
	) {
		// noop
	}

	async find({ query, limit, offset = 0, lang, shouldIncludeNutrients = true }: FoodFind): Promise<{ foods: Food[], totalCount: number }> {
		let where: any = {
			sourceType: 'food',
			field: 'name'
		}
		if (query) {
			where = {
				...where,
				text: { $like: `%${query}%` },
				lang,
			}
		}

		const { rows: foodVarietyTranslations, count } = await TranslationModel.findAndCountAll({
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
	}

	async findFoodVariety({ query, limit, offset = 0, lang, shouldIncludeNutrients = true }: FoodFind): Promise<{ foods: Food[], totalCount: number }> {
		let where: any = {
			sourceType: 'food_variety',
			field: 'name'
		}
		if (query) {
			where = {
				...where,
				text: { $like: `%${query}%` },
				lang,
			}
		}

		const { rows: foodVarietyTranslations, count } = await TranslationModel.findAndCountAll({
			where,
			limit,
			offset,
			include: [
				{
					model: FoodVarietyModel,
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
	}

	async findFoodVarietiesWithIds(publicIds: string[], lang: LANGUAGE_CODES) {
		const foodVarieties = await FoodVarietyModel.findAll({
			where: {
				publicId: { [Sequelize.Op.in]: publicIds }
			},
			include: [
				{
					model: TranslationModel,
					required: true,
					as: 'translations',
				},
				{
					model: FoodModel,
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
	}

	async findById(id: number, lang: LANGUAGE_CODES): Promise<Food> {
		const food = await FoodModel.findByPk(id, {
			include: [
				includeFoodTranslations(),
				includeFoodGroup(),
				// includeWeights(),
				includeContentsShallow(),
				// includeContentsFull(),
			],
		})
		if (!food) throw new Error(`food not found. id: ${id}`)

		const contentTranslations = await TranslationModel.findAll({
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
	}

	async findFoodByPublicId(publicId: string, lang: LANGUAGE_CODES): Promise<Food> {
		const food = await FoodModel.findOne({ where: { publicId } })
		if (!food) throw new Error(`food not found. publicId: ${publicId}`)

		return this.findById(food.id!, lang)
	}

	async findFoodVarietyByPublicId(publicId: string, lang: LANGUAGE_CODES): Promise<Food> {
		const foodVariety = await FoodVarietyModel.findOne({
			where: { publicId },
			include: [
				{
					model: TranslationModel,
					as: 'translations',
					required: true,
					where: {
						lang,
						sourceType: 'food_variety'
					},
				},
				{
					model: FoodModel,
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
	}

	async removeById(id: string) {
		const numberOfDestroyedElements = await FoodModel.destroy({
			where: {
				pid: id,
			}
		})

		return {
			id,
			deleted: numberOfDestroyedElements === 1,
		}
	}

	async create(data: FoodCreateInput, lang: LANGUAGE_CODES) {
		// check whether food group exists
		const fg = await FoodGroupModel.findOne({
			where: { publicId: data.foodGroupId }, include: [includeFoodTranslations()]
		})
		if (!fg) throw new Error('food group doesn\'t exist')

		/**
		 * Create food
		 * */
		return main.transaction((t: Transaction) => {
			const id = uuid()
			return FoodModel.create({
				publicId: id,
				isVerified: true,
				slug: id,
				origName: data.name,
				foodType: FOOD_TYPES.unknown,
				foodGroupId: fg.id,
				pictureFileName: data.imageUrl,
			}, { transaction: t })
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

					return TranslationModel.bulkCreate(translations, { transaction: t })
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
								image: food.pictureFileName ? setImageUrl(food.pictureFileName, false, food.id!) : undefined,
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
	}

	async listForTranslation({ limit = 25, offset = 0, sourceLang, targetLang, query, fgid, isVerified }: FoodTranslationList): Promise<{ foods: FoodTranslationO[], totalCount: number }> {
		let where: any = {}
		if (fgid) {
			where = {
				fgid,
			}
		}
		if (query) {
			const foodTrs = await TranslationModel.findAll({
				where: {
					[Sequelize.Op.or]: [{
						text: { [Sequelize.Op.regexp]: `^${query}` },
						field: 'name',
					}, {
						text: { [Sequelize.Op.regexp]: `^${query}` },
						field: 'description',
					}],
					sourceType: 'food',
				},
				limit,
			})
			if (Object.keys(where).length === 0) {
				where = {
					id: { $in: foodTrs.map(f => f.id) }
				}
			} else {
				where.id = { $in: foodTrs.map(f => f.id) }
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

		const { rows: foods, count: totalCount } = await FoodModel.findAndCountAll({
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
					image: food.pictureFileName ? { url: setImageUrl(food.pictureFileName, false, food.id!) } : undefined,
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
	}

	async submitTranslation(id: string, toLang: LANGUAGE_CODES, name: string): Promise<{ id: any, lang: LANGUAGE_CODES, name: string }> {
		const food = await FoodModel.findOne({ where: { publicId: id } })
		if (!food) throw new Error('invalid food')

		const ftrs = await TranslationModel.findAll({ where: { sourceId: food.id, sourceType: 'food', lang: toLang } })

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
			await TranslationModel.bulkCreate(translations)
		}

		// const tr = await FoodTr.findOne({where: {foodId: food.id, lang: toLang}})
		// if (!tr) throw new Error('no tr')

		return {
			id,
			lang: toLang,
			// description: description,
			name,
		}
	}

	async updateFood(id: string, lang: LANGUAGE_CODES, translations: FoodInput[], weights: Weight[], fgid: string, isVerified: boolean, image: any): Promise<FoodTranslationO> {
		const food = await FoodModel.findByPk(id/*, {
			include: [
				includeWeights(),
			],
		}*/)
		if (!food) throw new Error('not found')

		const tr = await Promise.all(translations.map(async (tr) => {
			return this.submitTranslation(id, tr.lang, tr.name)
		}))

		const fg = await FoodGroupModel.findByPk(fgid)
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

		let weightsOut: Weight[] = []
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
					return this.weightService.update(weight.id!, foundWeight)
				} else {
					// delete
					await this.weightService.delete(weight.id!)
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
						return this.weightService.create(food.id!, weight)
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
			image: food.pictureFileName ? { url: setImageUrl(food.pictureFileName, false, food.id!) } : undefined,
			translations: tr.map(i => ({
				name: i.name,
				description: i.name,
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
	}

	async getFoodGroups(lang: LANGUAGE_CODES): Promise<NameAndId[]> {
		const foodGroups = await FoodGroupModel.findAll({
			where: { parentId: null },
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
	}

	async getFood(id: string): Promise<Food> {
		return this.findFoodByPublicId(id, LANGUAGE_CODES.en) // TODO fixme
	}

	async getFoodVariety(id: string): Promise<Food> {
		return this.findFoodVarietyByPublicId(id, LANGUAGE_CODES.en)
	}

	async generateMealPlan(userId: string): Promise<MealPlan> {
		const user = await this.userService.findById(userId)
		if (!user.meals) throw new Error('no meals')

		const plan = await MealPlanner.generateMealPlan(user.meals)
		// const plans = user.mealPlans ? [...user.mealPlans, plan._id] : [plan._id]
		// console.log('==============>', p)
		user.mealPlans = user.mealPlans ? [...user.mealPlans, plan._id] : [plan._id]
		await this.userService.modify(userId, user)
		// do something
		return plan
	}

	async getUserMealPlan(userId: string, lang: LANGUAGE_CODES): Promise<MealPlan> {
		const c = await this.userService.getUserMealPlan(userId, lang)
		console.log('========', c)
		return c
	}

	// async generateMealPlan(userId, options) {
	// 	const user = await UserRepo.findById(userId)
	// 	const plan = new MealPlan()
	// 	plan.name = options.name
	//
	// 	if (user.meals.length == 0) {
	// 		throw Error(__('userHasNoMeals'))
	// 	}
	//
	// 	for (const day in WEEKDAYS) {
	// 		// @ts-ignore
	// 		plan[day] = {
	// 			meals: []
	// 		}
	// 		for (const meal of user.meals) {
	// 			// @ts-ignore
	// 			plan[day].meals.push({
	// 				...meal,
	// 				// TODO fill food
	// 			})
	// 		}
	// 	}
	//
	// 	return MealPlanRepo.create(plan)
	// },

	async searchMealItems(q: string, foodTypes: MEAL_ITEM_TYPES[], lang: LANGUAGE_CODES): Promise<MealItem[]> {
		// search through foods and recipes
		const foods = foodTypes.find(p => p === MEAL_ITEM_TYPES.food) ? await this._searchFoods(q, lang) : []
		// FIXME handle language in recipes search
		const recipes = foodTypes.find(p => p === MEAL_ITEM_TYPES.recipe) ? await this._searchRecipes(q) : []

		const mealItems: MealItem[] = []

		foods.forEach((food: Food) => {
			mealItems.push({
				title: food.name,
				subtitle: food.foodGroup ? food.foodGroup.map(fg => fg.name).join(', ') : '',
				thumbnail: food.image ? food.image : undefined,
				id: food.id,
				type: MEAL_ITEM_TYPES.food,
				weights: food.weights,
				nutritionalData: food.nutrients,
				// varieties: food.varieties,
				// subtitle: food.,
			})
		})

		recipes.forEach((recipe: Recipe) => {
			mealItems.push({
				title: recipe.title,
				thumbnail: recipe.thumbnail ? recipe.thumbnail : undefined,
				id: recipe.id,
				type: MEAL_ITEM_TYPES.recipe,
				// subtitle: food.,
			})
		})

		mealItems.sort((a, b) => getEditDistance(q, a.title || ''))
		mealItems.splice(10)

		return mealItems
	}

	private async _searchFoods(q: string, lang: LANGUAGE_CODES): Promise<Food[]> {
		// FIXME better search
		let foods = await this.findFoodVariety({
			query: q,
			limit: 5,
			lang,
			shouldIncludeNutrients: true,
		})

		return foods.foods
	}

	private async _searchRecipes(q: string): Promise<Recipe[]> {
		let recipes = await this.recipeService.find(5, 0, q)

		return recipes.recipes
	}
}
