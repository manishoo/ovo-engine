/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import FoodService from '@Services/food/food.service'
import { LANGUAGE_CODES, NameAndId } from '@Types/common'
import { Food, FoodInput, FoodsListResponse, FoodsTranslationListResponse, FoodTranslationO, } from '@Types/food'
import { MEAL_ITEM_TYPES } from '@Types/meals'
import { Weight, WeightInput } from '@Types/weight'
import Errors from '@Utils/errors'
import { GraphQLUpload } from 'apollo-server-express'
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { checkUser, Context } from '../utils'

@Service()
@Resolver()
export default class FoodResolver {
	constructor(
		// service injection
		private readonly foodService: FoodService
	) {
		// noop
	}

	@Query(returns => FoodsListResponse)
	async listFoods(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		if (page < 1) page = 0

		const data = await this.foodService.listFoodVarieties({
			limit: size,
			offset: (page - 1) * size,
			lang: ctx.lang,
			shouldIncludeNutrients: false,
		})
		return {
			foods: data.foods,
			pagination: {
				page,
				size,
				totalCount: data.totalCount,
				totalPages: Math.ceil(data.totalCount / size)
			},
		}
	}

	@Query(returns => FoodsTranslationListResponse)
	async listFoodsTranslation(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Arg('targetLang', type => String) targetLang: LANGUAGE_CODES,
		@Arg('sourceLang', type => String) sourceLang: LANGUAGE_CODES,
		@Ctx() ctx: Context,
		@Arg('q', type => String, { nullable: true }) q?: string,
		@Arg('fg', type => String, { nullable: true }) fg?: string,
		@Arg('isVerified', { nullable: true }) isVerified?: boolean,
	) {
		checkUser(ctx)
		// FIXME validate languages
		if (page < 1) page = 0

		const data = await this.foodService.listForTranslation({
			limit: size,
			offset: (page - 1) * size,
			targetLang,
			sourceLang,
			query: q,
			fgid: fg,
			isVerified,
		})
		return {
			foods: data.foods,
			pagination: {
				page,
				size,
				totalCount: data.totalCount,
				totalPages: Math.ceil(data.totalCount / size)
			},
		}
	}

	@Query(returns => [Food])
	async searchFoods(
		@Arg('q') q: string,
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		return this.foodService.searchMealItems(q, [MEAL_ITEM_TYPES.food], ctx.lang,)
	}

	@Query(returns => Food)
	async getFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	) {
		// FIXME
		checkUser(ctx)
		const food = await this.foodService.getFood(id)

		if (food) throw new Errors.NotFoundError('not found')
		return food
	}

	@Query(returns => [NameAndId])
	async getFoodGroups(
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		return this.foodService.getFoodGroups(ctx.lang)
	}

	@Mutation(returns => Boolean)
	async removeFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		if (!ctx.user) throw new Errors.ForbiddenError('not allowed')
		const r = await this.foodService.removeById(id)
		return r.deleted
	}

	@Mutation(returns => FoodTranslationO)
	async updateFood(
		@Arg('id') id: string,
		@Arg('translations', type => [FoodInput]) translations: FoodInput[],
		@Arg('weights', type => [WeightInput]) weights: WeightInput[],
		@Arg('fg') fgid: string,
		@Arg('isVerified') isVerified: boolean,
		@Ctx() ctx: Context,
		@Arg('image', type => GraphQLUpload, { nullable: true }) image?: any,
	) {
		checkUser(ctx)
		if (translations.length < 1) throw new Errors.ValidationError('no translations')

		return this.foodService.updateFood(id, ctx.lang, translations, weights.map(w => <Weight>w), fgid, isVerified, image)
	}
}
