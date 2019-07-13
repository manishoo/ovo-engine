/*
 * recipes.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Arg, Ctx, Field, InputType, Int, ObjectType, Query, Resolver} from 'type-graphql'
import {Recipe, RecipeInput, RecipesListResponse} from '@dao/models/recipe.model'
import {Context} from '@services/api-gateway/utils'
import RecipeService from '@services/recipe.service'
import {GraphQLUpload} from 'apollo-server-express'


@Resolver()
export default class RecipesResolver {
	@Query(returns => RecipesListResponse)
	listRecipes(
		@Arg('page', type => Int) page: number,
		@Arg('size', type => Int) size: number,
		@Ctx() ctx: Context,
		@Arg('q', type => String, {nullable: true}) q?: string,
	): Promise<RecipesListResponse> {
		return RecipeService.list(page, size, q)
	}

	@Query(returns => Recipe)
	getRecipe(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<Recipe> {
		return RecipeService.getOne(id)
	}

	@Query(returns => Boolean)
	deleteRecipe(
		@Arg('id') id: string,
		@Ctx() ctx: Context,
	): Promise<boolean> {
		return RecipeService.delete(id)
	}

	@Query(returns => Recipe)
	updateRecipe(
		@Arg('id') id: string,
		@Arg('data') data: RecipeInput,
		@Ctx() ctx: Context,
		// @ts-ignore
		@Arg('image', type => GraphQLUpload, {nullable: true}) image?: any,
	): Promise<Recipe> {
		return RecipeService.update(id, data, ctx.lang)
	}

	@Query(returns => Recipe)
	createRecipe(
		@Arg('data') data: RecipeInput,
		@Ctx() ctx: Context,
	): Promise<Recipe> {
		return RecipeService.create(data, ctx.lang)
	}
}
