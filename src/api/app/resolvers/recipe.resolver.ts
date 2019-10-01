/*
 * recipe.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeService from '@Services/recipe/recipe.service'
import TagService from '@Services/tag/tag.service'
import { ListRecipesArgs, Recipe, RecipeInput, RecipesListResponse } from '@Types/recipe'
import { Tag } from '@Types/tag'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { UserRole } from '@Types/common'


@Service()
@Resolver()
export default class RecipeResolver {
  constructor(
    // service injection
    private readonly recipeService: RecipeService,
    private readonly tagService: TagService,
  ) {
    // noop
  }

  @Query(returns => Recipe)
  async recipe(
    @Ctx() ctx: Context,
    @Arg('slug', { nullable: true }) slug?: string,
    @Arg('id', { nullable: true }) id?: string,
  ) {
    return this.recipeService.get(id, slug)
  }

  // @Authorized(UserRole.user)
  @Query(returns => RecipesListResponse)
  async recipes(
    @Args() { page, size, lastId, nameSearchQuery, userId, tags }: ListRecipesArgs,
    @Ctx() ctx: Context,
  ) {
    let viewerUser
    if (ctx.user) {
      viewerUser = ctx.user
    }

    return this.recipeService.list({
      page,
      size,
      lastId,
      nameSearchQuery,
      userId,
      viewerUser,
      tags,
    })
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Recipe)
  async createRecipe(
    @Arg('recipe') recipe: RecipeInput,
    @Ctx() ctx: Context,
  ) {
    return this.recipeService.create(recipe, ctx.lang, ctx.user!.id)
  }

  @Authorized()
  @Mutation(returns => Recipe)
  async updateRecipe(
    @Arg('recipeId') recipeId: string,
    @Arg('recipe') recipe: RecipeInput,
    @Ctx() ctx: Context,
  ) {
    return this.recipeService.update(recipeId, recipe, ctx.lang, ctx.user!)
  }

  @Authorized()
  @Mutation(returns => String)
  async deleteRecipe(
    @Arg('recipeId') recipeId: string,
    @Ctx() ctx: Context,
  ) {
    return this.recipeService.delete(recipeId, ctx.user!)
  }

  @Authorized()
  @Mutation(returns => Recipe)
  async tagRecipe(
    @Arg('recipeId') recipeId: string,
    @Arg('tags', type => [String]) tagSlugs: string[],
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    return this.recipeService.tag(recipeId, tagSlugs, ctx.user!)
  }

  @Query(returns => [Tag])
  async tags(
    @Ctx() ctx: Context,
  ): Promise<Tag[]> {
    return this.tagService.list()
  }
}
