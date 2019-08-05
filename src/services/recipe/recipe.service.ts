/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { RecipeModel } from '@Models/recipe.model'
import { transformRecipe } from '@Services/recipe/transformers/recipe.transformer'
import TagService from '@Services/tag/tag.service'
import UserService from '@Services/user/user.service'
import { Image, LanguageCode } from '@Types/common'
import { Recipe, RecipeInput, RecipesListResponse, RecipesQuery } from '@Types/recipe'
import Errors from '@Utils/errors'
import { processUpload } from '@Utils/upload/utils'
import { __ } from 'i18n'
import mongoose from 'mongoose'
import shortid from 'shortid'
import { Service } from 'typedi'
import uuid from 'uuid/v1'

const DEFAULT_PAGE_SIZE = 25

@Service()
export default class RecipeService {
	constructor(
		// service injection
		private readonly userService: UserService,
		private readonly tagService: TagService,
	) {
		// noop
	}

	async findById(id: string, userId?: string): Promise<Recipe> {
		const r = await RecipeModel.findOne({ publicId: id })
			.populate('author')
			.exec()
		if (!r) {
			throw new Errors.NotFound(__('notFound'))
		}

		return transformRecipe(r, userId, true)
	}

	async findBySlug(slug: string, userId?: string): Promise<Recipe> {
		const r = await RecipeModel.findOne({ slug })
			.populate('author')
			.exec()
		if (!r) {
			throw new Errors.NotFound(__('notFound'))
		}

		return transformRecipe(r, userId, true)
	}

	async listRecipesByLastId(query: RecipesQuery, userId?: string, lastId?: string): Promise<RecipesListResponse> {
		if (lastId) {
			const recipe = await RecipeModel.findOne({ publicId: lastId })
			if (!recipe) throw new Errors.NotFound('recipe not found')

			query.createdAt = { $lt: recipe.createdAt }
		}

		if (query.title) {
			query.title = { $regex: query.title }
		}

		const recipes = await RecipeModel.find(query)
			.limit(26)
			.sort({
				createdAt: -1,
			})
			.populate('author')
			.exec()
		if (!recipes) {
			throw new Errors.NotFound(__('notFound'))
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

	async listUserRecipesByLastId(userId: string, lastId?: string, viewerUserId?: string): Promise<RecipesListResponse> {
		return this.listRecipesByLastId({ author: new mongoose.Schema.Types.ObjectId(userId) }, viewerUserId, lastId)
	}

	async delete(id: string, userId?: string, operatorId?: string) {
		if (!userId && !operatorId) throw new Errors.Forbidden('not allowed')

		const query: any = { publicId: id }
		if (userId) {
			query.author = new mongoose.Schema.Types.ObjectId(userId)
		}
		const { ok } = await RecipeModel.remove(query)
		if (!ok) throw new Errors.System('something went wrong')
		return true
	}

	async find(limit: number, skip: number = 0, query?: string): Promise<{ recipes: Recipe[], totalCount: number }> {
		const q: { name?: any } = {}
		if (query) {
			q.name = { $regex: query }
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

	async update(publicId: string, data: Partial<RecipeInput>, lang: LanguageCode, userId?: string) {
		const recipe = await RecipeModel.findOne({ publicId })
			.populate('author')
			.exec()
		if (!recipe) throw new Errors.NotFound(__('notFound'))

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
			const foundRecipeWithTheSameSlug = await RecipeModel.findOne({ publicId: { $ne: publicId }, slug: data.slug })

			if (foundRecipeWithTheSameSlug) throw new Errors.Validation('recipe with the smae slug exists')

			recipe.slug = data.slug
		}
		if (data.tags) {
			recipe.tags = await Promise.all(data.tags.map(async slug => {
				const t = await this.tagService.findBySlug(slug) // TODO we should probably only make one request to db

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

	async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE, query?: string) {
		const { recipes, totalCount } = await this.find(
			size,
			(page - 1) * size,
			query,
		)

		return {
			recipes,
			pagination: {
				page,
				count: size,
				totalCount,
				totalPages: Math.ceil(totalCount / size),
			},
		}
	}

	async listUserRecipes(userId: string, lastId?: string, viewerUserId?: string, query?: string) {
		return this.listUserRecipesByLastId(userId, lastId, viewerUserId)
	}

	async listUserRecipesByPublicId(userPublicId: string, lastId?: string, viewerUserId?: string, query?: string) {
		const user = await this.userService.findByPublicId(userPublicId)
		if (!user) throw new Errors.NotFound('User not found')
		return this.listUserRecipesByLastId(String(user._id), lastId, viewerUserId)
	}

	async getOne(id?: string, slug?: string, userId?: string) {
		if (id) {
			return this.findById(id, userId)
		}
		if (slug) {
			return this.findBySlug(slug, userId)
		}

		throw new Errors.Validation('no slug or id provided')
	}

	async create(data: RecipeInput, lang: LanguageCode, userId?: string) {
		let authorObjectId
		if (userId) {
			const author = await this.userService.findById(userId)
			authorObjectId = author._id
		}

		let coverImage: Image | undefined = undefined

		const slugAddedId = shortid.generate()

		if (data.coverImage) {
			coverImage = {
				url: await processUpload(data.coverImage, `${data.slug}-${slugAddedId}`, 'recipes'),
			}
		}

		const id = uuid()

		const recipe: Partial<Recipe> = {
			// thumbnail: undefined,
			// video: undefined,
			// tags: undefined,
			publicId: id,
			coverImage,
			title: data.title,
			yield: data.yield,
			timing: {
				totalTime: data.totalTime,
				cookTime: data.cookTime,
				prepTime: data.prepTime,
			},
			slug: `${data.slug}-${slugAddedId}`,
			description: data.description,
			author: authorObjectId,
			instructions: data.instructions.map(instructionInput => ({
				text: instructionInput.text,
				step: instructionInput.step,
			})),
			ingredients: await Promise.all(data.ingredients.map(async ingredientInput => {
				//TODO check weights

				let name
				if (ingredientInput.name) {
					name = ingredientInput.name
				}
				if (!name) throw new Errors.Validation('ingredient name not provided')

				return {
					name,
					amount: ingredientInput.amount,
					description: ingredientInput.description,
					unit: ingredientInput.customUnit,
					weightId: ingredientInput.weightId,
					foodId: ingredientInput.foodId,
				}
			})),
		}


		const createdRecipe = await RecipeModel.create(recipe)

		const savedRecipe = await RecipeModel.findById(createdRecipe._id)
			.populate('author')
			.exec()

		if (!savedRecipe) throw new Errors.System('failed to create the recipe')
		return transformRecipe(savedRecipe, userId)
	}

	async search(q: string, userId?: string, lastId?: string) {
		return this.listRecipesByLastId({ title: q }, userId, lastId)
	}

	async tagRecipe(recipePublicId: string, tagSlugs: string[], userId: string): Promise<Recipe> {
		return this.update(recipePublicId, {
			tags: tagSlugs,
		}, LanguageCode.en, userId)
	}
}
