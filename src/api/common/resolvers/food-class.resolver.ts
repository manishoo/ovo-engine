/*
 * food-class.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Food } from '@Types/food'
import { FoodClass } from '@Types/food-class'
import { Context } from '@Utils/context'
import Errors from '@Utils/errors'
import { Arg, Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => FoodClass)
export default class FoodClassResolver implements ResolverInterface<FoodClass> {
  @FieldResolver(returns => String)
  id(@Root() foodClass: FoodClass) {
    return String(foodClass._id)
  }

  @FieldResolver(returns => Food)
  async food(@Root() foodClass: FoodClass, @Ctx() { dataSources }: Context, @Arg('foodId', { nullable: true }) foodId?: ObjectId): Promise<Food | undefined> {
    if (!foodClass.defaultFood && !foodId) return

    const food = await dataSources.foods.get(foodId || foodClass.defaultFood!)
    if (!food) throw new Errors.System('defaultFood and food incompatible')

    return food
  }
}
