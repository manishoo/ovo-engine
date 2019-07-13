/*
 * recipe.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Arg, Ctx, Query, Mutation} from 'type-graphql'
import {checkUser, Context} from '@services/api-gateway/utils'
import FoodService from '@services/food/food.service'
import {Recipe, RecipeInput, RecipesListResponse} from '@dao/models/recipe.model'
import RecipeService from '@services/recipe.service'
import {MEAL_ITEM_TYPES, TAG_TYPE} from '~/constants/enums'
import {MealItem} from '@dao/types'
import {Tag, TagInput} from '@dao/models/tag.model'
import TagService from '@services/tag.service'


@Resolver()
export default class RecipeResolver {
	@Query(returns => Recipe)
	async getRecipe(
		@Ctx() ctx: Context,
		@Arg('slug', {nullable: true}) slug?: string,
		@Arg('id', {nullable: true}) id?: string,
	): Promise<Recipe> {
		let userId
		if (ctx.user) {
			userId = ctx.user.id
		}
		return RecipeService.getOne(id, slug, userId)
	}

	@Query(returns => RecipesListResponse)
	async listMyRecipes(
		@Ctx() ctx: Context,
		@Arg('lastId', {nullable: true}) lastId?: string,
	): Promise<RecipesListResponse> {
		const user = checkUser(ctx)
		return RecipeService.listUserRecipes(user.id, lastId, user.id)
	}

	@Query(returns => RecipesListResponse)
	async listRecipes(
		@Arg('userId') userPublicId: string,
		@Ctx() ctx: Context,
		@Arg('lastId', {nullable: true}) lastId?: string,
	): Promise<RecipesListResponse> {
		let viewerUserId
		if (ctx.user) {
			viewerUserId = ctx.user.id
		}
		return RecipeService.listUserRecipesByPublicId(userPublicId, lastId, viewerUserId)
	}

	@Mutation(returns => Recipe)
	async createRecipe(
		@Arg('recipe') recipe: RecipeInput,
		@Ctx() ctx: Context,
	): Promise<Recipe> {
		const user = checkUser(ctx)
		return RecipeService.create(recipe, ctx.lang, user.id)
	}

	@Mutation(returns => Recipe)
	async updateRecipe(
		@Arg('id') recipePublicId: string,
		@Arg('recipe') recipe: RecipeInput,
		@Ctx() ctx: Context,
	): Promise<Recipe> {
		const user = checkUser(ctx)
		return RecipeService.update(recipePublicId, recipe, ctx.lang, user.id)
	}

	@Mutation(returns => Boolean)
	async deleteRecipe(
		@Arg('recipeId') recipeId: string,
		@Ctx() ctx: Context,
	): Promise<Boolean> {
		const user = checkUser(ctx)
		return RecipeService.delete(recipeId, user.id)
	}

	@Query(returns => RecipesListResponse)
	async searchRecipes(
		@Arg('q') q: string,
		@Ctx() ctx: Context,
		@Arg('lastId', {nullable: true}) lastId?: string,
	): Promise<RecipesListResponse> {
		let userId
		if (ctx.user) {
			userId = ctx.user.id
		}
		return RecipeService.search(q, userId, lastId)
	}

	@Mutation(returns => Recipe)
	async tagRecipe(
		@Arg('id', type => String) publicId: string,
		@Arg('tags', type => [String]) tagSlugs: string[],
		@Ctx() ctx: Context,
	): Promise<Recipe> {
		const user = checkUser(ctx)
		return RecipeService.tagRecipe(publicId, tagSlugs, user.id)
	}

	@Query(returns => [Tag])
	async getTags(
		@Ctx() ctx: Context,
	): Promise<Tag[]> {
		return TagService.list()
	}
}
