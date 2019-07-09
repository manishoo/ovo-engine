/*
 * meals.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Arg, Ctx, Field, InputType, Int, ObjectType, Query, Resolver} from 'type-graphql'
import {MealsListResponse} from 'src/dao/types'
import {Meal} from 'src/dao/models/meal.model'
import MealService from 'src/services/meal.service'
import {Context} from '~/services/api-gateway/utils'


@InputType()
export class MealItemInput {
	@Field({nullable: true})
	unit?: string
	@Field()
	amount: number
	@Field()
	foodId?: string

}

@InputType()
export class MealInput {
	@Field()
	title: string
}


@Resolver()
export default class MealsResolver {
	@Query(returns => MealsListResponse)
	listMeals(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Ctx() ctx: Context,
		@Arg('q', type => String, { nullable: true }) q?: string,
	): Promise<MealsListResponse> {
		return MealService.list(page, size, q)
	}

	@Query(returns => Meal)
	getMeal(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Meal> {
		return MealService.getOne(id)
	}

	@Query(returns => Boolean)
	deleteMeal(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<boolean> {
		return MealService.delete(id)
	}

	@Query(returns => Meal)
	updateMeal(
		@Arg('id') id: string,
		@Arg('data') data: MealInput,
		@Ctx() ctx: Context,
	): Promise<Meal> {
		return MealService.update(id, data)
	}

	@Query(returns => Meal)
	createMeal(
		@Arg('data') data: MealInput,
		@Ctx() ctx: Context,
	): Promise<Meal> {
		return MealService.create(data)
	}
}