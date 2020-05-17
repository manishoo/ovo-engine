/*
 * meal-item.resolver.ts
 * Copyright: Ouranos Studio 2020. All rights reserved.
 */

import { Ingredient, IngredientItemUnion } from '@Types/ingredient'
import { Context } from '@Utils/context'
import { Ctx, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver(of => Ingredient)
export default class IngredientResolver implements ResolverInterface<Ingredient> {
  @FieldResolver(returns => IngredientItemUnion)
  async item(@Root() ingredient: Ingredient, @Ctx() { dataSources }: Context): Promise<typeof IngredientItemUnion | undefined> {
    if (!ingredient.item) return

    if (!('ref' in ingredient.item)) return ingredient.item

    switch (ingredient.item.ref) {
      case 'food':
        return dataSources.foods.get(ingredient.item.id)
      case 'recipe':
        return dataSources.recipes.get(ingredient.item.id, dataSources.foods)
    }
  }
}
