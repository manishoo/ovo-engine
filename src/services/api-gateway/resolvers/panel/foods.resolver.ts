/*
 * foods.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Resolver, Arg, Ctx, Query, Mutation, Int} from 'type-graphql'
import {
	Food,
	FoodInput,
	FoodsListResponse,
	FoodsTranslationListResponse,
	FoodTranslationO, WeightInput, Weight, NameAndId
} from 'src/dao/types'
import FoodRepo from 'src/dao/repositories/food.repository'
import {LANGUAGE_CODES} from 'src/constants/enums'
import {GraphQLUpload} from 'apollo-server-express'
import {checkUser, Context} from '~/services/api-gateway/utils'


@Resolver()
export default
class FoodsResolver {
	@Query(returns => FoodsListResponse)
	async listFoods(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		if (!ctx.user) throw new Error('no user')
		if (page < 1) page = 0

		const data = await FoodRepo.find({
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
		if (!ctx.user) throw new Error('no user')
		if (page < 1) page = 0

		const data = await FoodRepo.listForTranslation({
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
		return FoodRepo.find({
			query: q,
			limit: 10,
			offset: 0,
			lang: ctx.lang,
		})
	}

	@Query(returns => Food)
	async getFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	) {
		// FIXME
		checkUser(ctx)
		const { foods } = await FoodRepo.find({
			limit: 1,
			lang: ctx.lang,
		})

		if (foods.length === 0) throw new Error('not found')
		return foods[0]
	}

	@Query(returns => [NameAndId])
	async getFoodGroups(
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		return FoodRepo.getFoodGroups(ctx.lang)
	}

	// @Mutation(returns => Food)
	// async createFood(
	// 	@Arg('q') q: string,
	// 	@Ctx() ctx: Context,
	// ) {
	// 	//
	// }
	//
	// @Mutation(returns => Food)
	// async updateFood(
	// 	@Arg('q') q: string,
	// 	@Ctx() ctx: Context,
	// ) {
	// 	//
	// }

	@Mutation(returns => Boolean)
	async removeFood(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	) {
		checkUser(ctx)
		if (!ctx.user) throw new Error('not allowed')
		const r = await FoodRepo.removeById(id)
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
		// @ts-ignore
		@Arg('image', type => GraphQLUpload, { nullable: true }) image?: any,
	) {
		checkUser(ctx)
		if (translations.length < 1) throw new Error('no translations')

		return FoodRepo.updateFood(id, ctx.lang, translations, weights.map(w => <Weight>w), fgid, isVerified, image)
	}
}
