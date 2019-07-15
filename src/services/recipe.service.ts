/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeRepository from '@dao/repositories/recipe.repository'
import {Recipe, RecipeInput} from '@dao/models/recipe.model'
import UserRepo from '@dao/repositories/user.repository'
import uuid from 'uuid/v1'
import {processUpload} from '@utils/upload/utils'
import shortid from 'shortid'
import {LANGUAGE_CODES} from '~/constants/enums'
import {Image} from '@dao/types'

const DEFAULT_PAGE_SIZE = 25

export default class RecipeService {
	static async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE, query?: string) {
		const {recipes, totalCount} = await RecipeRepository.find(
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

	static async listUserRecipes(userId: string, lastId?: string, viewerUserId?: string, query?: string) {
		return RecipeRepository.listUserRecipesByLastId(userId, lastId, viewerUserId)
	}

	static async listUserRecipesByPublicId(userPublicId: string, lastId?: string, viewerUserId?: string, query?: string) {
		const user = await UserRepo.findByPublicId(userPublicId)
		if (!user) throw new Error('User not found')
		return RecipeRepository.listUserRecipesByLastId(String(user._id), lastId, viewerUserId)
	}

	static async getOne(id?: string, slug?: string, userId?: string) {
		if (id) {
			return RecipeRepository.findById(id, userId)
		}
		if (slug) {
			return RecipeRepository.findBySlug(slug, userId)
		}

		throw new Error('no slug or id provided')
	}

	static async delete(publicId: string, userId?: string, operatorId?: string) {
		if (!userId && !operatorId) throw new Error('not allowed')

		const {ok} = await RecipeRepository.delete(publicId, userId, operatorId)
		if (!ok) throw new Error('something went wrong')

		return true
	}

	static async update(publicId: string, data: RecipeInput, lang: LANGUAGE_CODES, userId?: string) {
		return RecipeRepository.update(publicId, data, lang, userId)
	}

	static async create(data: RecipeInput, lang: LANGUAGE_CODES, userId?: string) {
		let authorObjectId
		if (userId) {
			const author = await UserRepo.findById(userId)
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
				if (!name) throw new Error('ingredient name not provided')

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

		return RecipeRepository.create(recipe, userId)
	}

	static async search(q: string, userId?: string, lastId?: string) {
		return RecipeRepository.listRecipesByLastId({title: q}, userId, lastId)
	}

	static async tagRecipe(recipePublicId: string, tagSlugs: string[], userId: string): Promise<Recipe> {
		return RecipeRepository.update(recipePublicId, {
			tags: tagSlugs,
		}, LANGUAGE_CODES.en, userId)
	}
}
