/*
 * meal-item.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { ObjectId } from '@Types/common'
import { Recipe } from '@Types/recipe'
import { Author } from '@Types/user'
import { Context } from '@Utils/context'
import { Ctx, FieldResolver, Int, Resolver, ResolverInterface, Root } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => Recipe)
export default class RecipeResolver implements ResolverInterface<Recipe> {
  @FieldResolver(returns => Int)
  userLikedRecipe(@Root() recipe: Recipe, @Ctx() ctx: Context) {
    return !!(recipe.likes || []).find(p => String(p) === ctx.user!.id)
  }

  @FieldResolver(returns => Int)
  likesCount(@Root() recipe: Recipe) {
    return recipe.likes.length
  }

  @FieldResolver(returns => String)
  id(@Root() recipe: Recipe) {
    return String(recipe._id)
  }

  @FieldResolver(returns => Author)
  async author(@Root() recipe: Recipe, @Ctx() { dataSources }: Context): Promise<Author> {
    if (!ObjectId.isValid(recipe.author as ObjectId)) {
      return recipe.author as Author
    }

    return dataSources.users.get(recipe.author as ObjectId)
  }
}
