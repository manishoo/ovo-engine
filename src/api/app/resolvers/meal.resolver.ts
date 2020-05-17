/*
 * meal.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Meal } from '@Types/meal'
import { Author } from '@Types/user'
import { Context } from '@Utils/context'
import { Ctx, FieldResolver, Int, Resolver, ResolverInterface, Root } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => Meal)
export default class MealResolver implements ResolverInterface<Meal> {
  @FieldResolver(returns => String)
  async id(@Root() meal: Meal): Promise<string> {
    return String(meal._id)
  }

  @FieldResolver(returns => Int)
  async likesCount(@Root() meal: Meal): Promise<number> {
    return meal.likes.length
  }

  @FieldResolver(returns => Author)
  async author(@Root() meal: Meal, @Ctx() { dataSources }: Context): Promise<Author> {
    return dataSources.users.get(meal.author as ObjectId)
  }
}
