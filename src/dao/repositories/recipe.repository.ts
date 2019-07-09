/*
 * recipe.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Recipe, RecipeInput, RecipeModel, RecipesListResponse} from '~/dao/models/recipe.model'
import {__} from 'i18n'
import WeightRepo from '~/dao/repositories/weight.repository'
import FoodRepo from '~/dao/repositories/food.repository'
import {LANGUAGE_CODES} from '~/constants/enums'
import {InstanceType} from 'typegoose'
import {ObjectId} from 'bson'
import {User} from '~/dao/models/user.model'
import TagRepository from '~/dao/repositories/tag.repository'
import {processUpload} from '~/utils/upload/utils'
import shortid from 'shortid'

async function transformRecipe(recipe: InstanceType<Recipe>, userId?: string, full: boolean = false, lang: LANGUAGE_CODES = LANGUAGE_CODES.en): Promise<Recipe> {
	recipe = recipe.toObject()
	recipe.id = recipe.publicId
	recipe.likesCount = recipe.likes.length
	recipe.likedByUser = userId ? !!recipe.likes.find(p => String(p) === userId) : false

	if (Object(recipe.author).hasOwnProperty('publicId')) {
		recipe.author = transformRecipeUser(recipe.author as User)
	}

	// FIXME weight

	if (full) {
		recipe.ingredients = await Promise.all(recipe.ingredients.map(async ingredient => {
			if (ingredient.weightId) { // FIXME use population
				ingredient.weight = await WeightRepo.findByPublicId(ingredient.weightId, lang)
			}/* else {
			ingredient.unit = 'g' // FIXME multilanguage
		}*/

			if (ingredient.foodId) {
				const food = await FoodRepo.findFoodVarietyByPublicId(ingredient.foodId, lang)
				if (!ingredient.name) {
					ingredient.name = food.name
				}
				ingredient.thumbnail = food.image
			}

			return ingredient
		}))
	}

	return recipe
}

function transformRecipeUser(user: User): Partial<User> {
	return {
		id: user.publicId,
		username: user.username,
		avatar: user.avatar,
		firstName: user.firstName,
		lastName: user.lastName,
	}
}

export interface RecipesQuery {
	_id?: any
	createdAt?: any
	author?: any
	title?: any
}

class RecipeRepository {
	static async findById(id: string, userId?: string): Promise<Recipe> {
		const r = await RecipeModel.findOne({publicId: id})
			.populate('author')
			.exec()
		if (!r) {
			throw new Error(__('notFound'))
		}

		return transformRecipe(r, userId, true)
	}

	static async findBySlug(slug: string, userId?: string): Promise<Recipe> {
		const r = await RecipeModel.findOne({slug})
			.populate('author')
			.exec()
		if (!r) {
			throw new Error(__('notFound'))
		}

		return transformRecipe(r, userId, true)
	}

	static async listRecipesByLastId(query: RecipesQuery, userId?: string, lastId?: string): Promise<RecipesListResponse> {
		if (lastId) {
			const recipe = await RecipeModel.findOne({publicId: lastId})
			if (!recipe) throw new Error('recipe not found')

			query.createdAt = {$lt: recipe.createdAt}
		}

		if (query.title) {
			query.title = {$regex: query.title}
		}

		const recipes = await RecipeModel.find(query)
			.limit(26)
			.sort({
				createdAt: -1,
			})
			.populate('author')
			.exec()
		if (!recipes) {
			throw new Error(__('notFound'))
		}

		let hasNext = false
		let lastRecipeId
		if (recipes.length == 26) {
			hasNext = true
			recipes.pop()
		}
		if (recipes.length > 0) {
			lastRecipeId = recipes[recipes.length - 1].publicId
		}

		return {
			recipes: await Promise.all(recipes.map(r => transformRecipe(r, userId))),
			pagination: {
				hasNext,
				lastId: lastRecipeId,
			}
		}
	}

	static async listUserRecipesByLastId(userId: string, lastId?: string, viewerUserId?: string): Promise<RecipesListResponse> {
		return this.listRecipesByLastId({author: new ObjectId(userId)}, viewerUserId, lastId)
	}

	static async searchRecipesByLastId(userId: string, lastId?: string): Promise<{ recipes: Recipe[], hasNext: boolean, lastId?: string }> {
		const query: any = {author: new ObjectId(userId)}
		if (lastId) {
			const recipe = await RecipeModel.findById(lastId)
			if (!recipe) throw new Error('recipe not found')

			query._id = {$gt: recipe._id}
		}

		const recipes = await RecipeModel.find(query).limit(26)
			.populate('author')
			.exec()
		if (!recipes) {
			throw new Error(__('notFound'))
		}

		let hasNext = false
		let lastRecipeId
		if (recipes.length == 26) {
			hasNext = true
			recipes.pop()
		}
		if (recipes.length > 0) {
			lastRecipeId = recipes[recipes.length - 1].publicId
		}

		return {
			recipes: await Promise.all(recipes.map(r => transformRecipe(r, userId))),
			hasNext,
			lastId: lastRecipeId,
		}
	}

	static async findOne(query: {}): Promise<Recipe> {
		const r = await RecipeModel.findOne(query)
			.populate('author')
			.exec()
		if (!r) throw new Error(__('notFound'))
		return transformRecipe(r)
	}

	static async create(data: Partial<Recipe>, userId?: string) {
		const createdRecipe = await RecipeModel.create(data)

		const recipe = await RecipeModel.findById(createdRecipe._id)
			.populate('author')
			.exec()

		return transformRecipe(recipe!, userId)
	}

	//
	// async createMany(data: Recipe[]) {
	// 	return RecipeModel.insertMany(data)
	// },

	static async delete(id: string, userId?: string, operatorId?: string) {
		const query: any = {publicId: id}
		if (userId) {
			query.author = new ObjectId(userId)
		}
		return RecipeModel.remove(query)
	}

	static async find(limit: number, skip: number = 0, query?: string): Promise<{ recipes: Recipe[], totalCount: number }> {
		const q: { name?: any } = {}
		if (query) {
			q.name = {$regex: query}
		}
		const results = await RecipeModel.find(q)
			.limit(limit)
			.skip(skip)
			.populate('author')
			.exec()
		const totalCount = await RecipeModel.count(q)

		return {
			recipes: await Promise.all(results.map(recipe => transformRecipe(recipe))),
			totalCount,
		}
	}

	static async update(publicId: string, data: Partial<RecipeInput>, lang: LANGUAGE_CODES, userId?: string) {
		const recipe = await RecipeModel.findOne({publicId})
			.populate('author')
			.exec()
		if (!recipe) throw new Error(__('notFound'))

		if (data.title) {
			recipe.title = data.title
		}
		if (data.description) {
			recipe.description = data.description
		}
		if (data.ingredients) {
			recipe.ingredients = data.ingredients.map(ingredient => {
				return {
					name: ingredient.name,
					amount: ingredient.amount,
					unit: ingredient.customUnit,
					foodId: ingredient.foodId,
					weightId: ingredient.weightId,
					description: ingredient.description,
				}
			})
		}
		if (data.instructions) {
			recipe.instructions = data.instructions.map(ingredient => {
				return {
					step: ingredient.step,
					text: ingredient.text,
				}
			})
		}
		if (data.coverImage) {
			recipe.coverImage = {
				url: await processUpload(data.coverImage, `${data.slug}-${shortid.generate()}`, 'recipes'),
			}
		}
		if (data.totalTime) {
			recipe.timing = {
				...recipe.timing,
				totalTime: data.totalTime
			}
		}
		if (data.prepTime) {
			recipe.timing = {
				...recipe.timing,
				prepTime: data.prepTime
			}
		}
		if (data.cookTime) {
			recipe.timing = {
				...recipe.timing,
				cookTime: data.cookTime
			}
		}
		if (data.yield) {
			recipe.yield = data.yield
		}
		if (data.slug) {
			const foundRecipeWithTheSameSlug = await RecipeModel.findOne({publicId: {$ne: publicId}, slug: data.slug})

			if (foundRecipeWithTheSameSlug) throw new Error('recipe with the smae slug exists')

			recipe.slug = data.slug
		}
		if (data.tags) {
			recipe.tags = await Promise.all(data.tags.map(async slug => {
				const t = await TagRepository.findBySlug(slug) // TODO we should probably only make one request to db

				return {
					_id: t._id,
					slug: t.slug,
					title: t.title,
					type: t.type,
				}
			}))
		}
		// TODO: actually update the recipe


		console.log('recipe', recipe)
		await recipe.save()

		return transformRecipe(recipe, userId, true, lang)
	}

	// list and search
}

export default RecipeRepository
