/*
 * meals.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealService from '@Services/meal/meal.service'
import { MealTemplate } from '@Types/meal-template'
import { MealsListResponse } from '@Types/meals'
import { Arg, Ctx, Field, InputType, Int, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


@InputType() // TODO move out of here
export class MealItemInput {
	@Field({ nullable: true })
	unit?: string
	@Field()
	amount: number
	@Field()
	foodId?: string

}

@InputType() // TODO move out of here
export class MealInput {
	@Field()
	title: string
}


@Service()
@Resolver()
export default class MealResolver {
	constructor(
		// service injection
		private readonly mealService: MealService
	) {
		// noop
	}

	@Query(returns => MealsListResponse)
	listMeals(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Ctx() ctx: Context,
		@Arg('q', type => String, { nullable: true }) q?: string,
	): Promise<MealsListResponse> {
		return this.mealService.list(page, size, q)
	}

	@Query(returns => MealTemplate)
	getMeal(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<MealTemplate> {
		return this.mealService.getOne(id)
	}

	@Query(returns => Boolean)
	deleteMeal(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<boolean> {
		return this.mealService.delete(id)
	}

	@Query(returns => MealTemplate)
	updateMeal(
		@Arg('id') id: string,
		@Arg('data') data: MealInput,
		@Ctx() ctx: Context,
	): Promise<MealTemplate> {
		return this.mealService.update(id, data)
	}

	@Query(returns => MealTemplate)
	createMeal(
		@Arg('data') data: MealInput,
		@Ctx() ctx: Context,
	): Promise<MealTemplate> {
		return this.mealService.create(data)
	}
}
