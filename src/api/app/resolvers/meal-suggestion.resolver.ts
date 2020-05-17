/*
 * meal-suggesttion.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import MealSuggestionService, { SuggestMealInput, SuggestMealItemInput } from '@Services/meal/suggestion.service'
import { DayMeal } from '@Types/calendar'
import { ObjectId } from '@Types/common'
import { MealItem } from '@Types/meal'
import { NutritionProfileInput, UserMealInput } from '@Types/user'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class MealSuggestionResolver {
  constructor(
    // service injection
    private readonly mealSuggestionService: MealSuggestionService,
  ) {
    // noop
  }

  @Authorized()
  @Mutation(returns => MealItem)
  async suggestMealItem(
    @Args() suggestMealItemInput: SuggestMealItemInput,
    @Ctx() ctx: Context,
  ): Promise<MealItem> {
    return this.mealSuggestionService.suggestMealItem(suggestMealItemInput, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => DayMeal)
  async suggestMeal(
    @Args() suggestMealInput: SuggestMealInput,
    @Ctx() ctx: Context,
  ): Promise<DayMeal> {
    return this.mealSuggestionService.suggestMeal(suggestMealInput, ctx.user!.id)
  }

  @Mutation(returns => [DayMeal])
  async suggestDayGuest(
    @Ctx() ctx: Context,
    @Arg('nutritionProfile', type => NutritionProfileInput) nutritionProfile: NutritionProfileInput,
    @Arg('userMeals', type => [UserMealInput]) userMeals: UserMealInput[],
    @Arg('dietId', { nullable: true }) dietId?: ObjectId,
  ): Promise<DayMeal[]> {
    return this.mealSuggestionService.suggestDayMeals(userMeals, nutritionProfile, dietId)
  }
}
