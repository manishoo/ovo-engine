/*
 * recipe.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import RecipeService from '@Services/recipe/recipe.service'
import TagService from '@Services/tag/tag.service'
import { Role, ObjectId } from '@Types/common'
import { ListRecipesArgs, Recipe, RecipeInput, RecipesListResponse } from '@Types/recipe'
import { Tag } from '@Types/tag'
import { Context } from '@Utils/context'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


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
    @Arg('id', { nullable: true }) id?: ObjectId,
  ) {
    return this.recipeService.get(id, slug)
  }

  // @Authorized(Role.user)
  @Query(returns => RecipesListResponse)
  async recipes(
    @Args() { page, size, lastId, nameSearchQuery, userId, tags, latest, ingredients, diets }: ListRecipesArgs,
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
      latest,
      ingredients,
      diets,
    })
  }

  @Authorized(Role.user)
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
    @Arg('recipeId') recipeId: ObjectId,
    @Arg('recipe') recipe: RecipeInput,
    @Ctx() ctx: Context,
  ) {
    return this.recipeService.update(recipeId, recipe, ctx.lang, ctx.user!)
  }

  @Authorized()
  @Mutation(returns => String)
  async deleteRecipe(
    @Arg('recipeId') recipeId: ObjectId,
    @Ctx() ctx: Context,
  ) {
    return this.recipeService.delete(recipeId, ctx.user!)
  }

  @Authorized()
  @Mutation(returns => Recipe)
  async tagRecipe(
    @Arg('recipeId') recipeId: ObjectId,
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
