/*
 * recipe.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeService from '@Services/recipe/recipe.service'
import { Recipe, RecipeInput, RecipesListResponse } from '@Types/recipe'
import { GraphQLUpload } from 'apollo-server'
import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


@Service()
@Resolver()
export default class RecipeResolver {
  constructor(
    // service injection
    private readonly recipeService: RecipeService,
  ) {
    // noop
  }

  @Query(returns => RecipesListResponse)
  listRecipes(
    @Arg('page', type => Int) page: number,
    @Arg('size', type => Int) size: number,
    @Ctx() ctx: Context,
    @Arg('q', type => String, { nullable: true }) q?: string,
  ): Promise<RecipesListResponse> {
    return this.recipeService.list(page, size, q)
  }

  @Query(returns => Recipe)
  getRecipe(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    return this.recipeService.getOne(id)
  }

  @Query(returns => Boolean)
  deleteRecipe(
    @Arg('id') id: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    return this.recipeService.delete(id)
  }

  @Query(returns => Recipe)
  updateRecipe(
    @Arg('id') id: string,
    @Arg('data') data: RecipeInput,
    @Ctx() ctx: Context,
    // @ts-ignore
    @Arg('image', type => GraphQLUpload, { nullable: true }) image?: any,
  ): Promise<Recipe> {
    return this.recipeService.update(id, data, ctx.lang)
  }

  @Query(returns => Recipe)
  createRecipe(
    @Arg('data') data: RecipeInput,
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    return this.recipeService.create(data, ctx.lang)
  }
}
