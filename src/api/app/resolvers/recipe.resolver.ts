/*
 * recipe.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeService from '@Services/recipe/recipe.service'
import TagService from '@Services/tag/tag.service'
import { Recipe, RecipeInput, RecipesListResponse } from '@Types/recipe'
import { Tag } from '@Types/tag'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { checkUser, Context } from '../utils'


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
  async getRecipe(
    @Ctx() ctx: Context,
    @Arg('slug', { nullable: true }) slug?: string,
    @Arg('id', { nullable: true }) id?: string,
  ): Promise<Recipe> {
    let userId
    if (ctx.user) {
      userId = ctx.user.id
    }
    return this.recipeService.getOne(id, slug, userId)
  }

  @Query(returns => RecipesListResponse)
  async listMyRecipes(
    @Ctx() ctx: Context,
    @Arg('lastId', { nullable: true }) lastId?: string,
  ): Promise<RecipesListResponse> {
    const user = checkUser(ctx)
    return this.recipeService.listUserRecipes(user.id, lastId, user.id)
  }

  @Query(returns => RecipesListResponse)
  async listRecipes(
    @Arg('userId') userPublicId: string,
    @Ctx() ctx: Context,
    @Arg('lastId', { nullable: true }) lastId?: string,
  ): Promise<RecipesListResponse> {
    let viewerUserId
    if (ctx.user) {
      viewerUserId = ctx.user.id
    }
    return this.recipeService.listUserRecipesByPublicId(userPublicId, lastId, viewerUserId)
  }

  @Mutation(returns => Recipe)
  async createRecipe(
    @Arg('recipe') recipe: RecipeInput,
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    const user = checkUser(ctx)
    return this.recipeService.create(recipe, ctx.lang, user.id)
  }

  @Mutation(returns => Recipe)
  async updateRecipe(
    @Arg('id') recipePublicId: string,
    @Arg('recipe') recipe: RecipeInput,
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    const user = checkUser(ctx)
    return this.recipeService.update(recipePublicId, recipe, ctx.lang, user.id)
  }

  @Mutation(returns => Boolean)
  async deleteRecipe(
    @Arg('recipeId') recipeId: string,
    @Ctx() ctx: Context,
  ): Promise<Boolean> {
    const user = checkUser(ctx)
    return this.recipeService.delete(recipeId, user.id)
  }

  @Query(returns => RecipesListResponse)
  async searchRecipes(
    @Arg('q') q: string,
    @Ctx() ctx: Context,
    @Arg('lastId', { nullable: true }) lastId?: string,
  ): Promise<RecipesListResponse> {
    let userId
    if (ctx.user) {
      userId = ctx.user.id
    }
    return this.recipeService.search(q, userId, lastId)
  }

  @Mutation(returns => Recipe)
  async tagRecipe(
    @Arg('id', type => String) publicId: string,
    @Arg('tags', type => [String]) tagSlugs: string[],
    @Ctx() ctx: Context,
  ): Promise<Recipe> {
    const user = checkUser(ctx)
    return this.recipeService.tagRecipe(publicId, tagSlugs, user.id)
  }

  @Query(returns => [Tag])
  async getTags(
    @Ctx() ctx: Context,
  ): Promise<Tag[]> {
    return this.tagService.list()
  }
}
