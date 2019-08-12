/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { RecipeModel } from '@Models/recipe.model'
import { transformRecipe } from '@Services/recipe/transformers/recipe.transformer'
import TagService from '@Services/tag/tag.service'
import UserService from '@Services/user/user.service'
import { Image, LanguageCode } from '@Types/common'
import { ListRecipesArgs, Recipe, RecipeInput } from '@Types/recipe'
import Errors from '@Utils/errors'
import { processUpload } from '@Utils/upload/utils'
import { __ } from 'i18n'
import mongoose from 'mongoose'
import shortid from 'shortid'
import { Service } from 'typedi'
import uuid from 'uuid/v1'


@Service()
export default class RecipeService {
  constructor(
    // service injection
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {
    // noop
  }

  async get(id?: string, slug?: string) {
    if (!id && !slug) throw new Errors.Validation('Recipe id or slug must be provided')

    const q: { slug?: string, _id?: mongoose.Types.ObjectId } = {}

    if (id) {
      q._id = mongoose.Types.ObjectId(id)
    }
    if (slug) {
      q.slug = slug
    }

    const recipe = await RecipeModel.findOne(q)
      .populate('author')
      .exec()

    if (!recipe) throw new Errors.NotFound('Recipe not found')

    return recipe
  }

  async list(variables: ListRecipesArgs) {
    const q: { title?: any, createdAt?: any } = {}
    if (variables.nameSearchQuery) {
      q.title = { $regex: variables.nameSearchQuery }
    }

    if (variables.lastId) {
      if (!mongoose.Types.ObjectId.isValid(variables.lastId)) throw new Errors.Validation('LastId is not valid')

      const recipe = await RecipeModel.findById(variables.lastId)
      if (!recipe) throw new Errors.NotFound('recipe not found')

      q.createdAt = { $lt: recipe.createdAt }
    }

    const recipes = await RecipeModel.find(q)
      .sort({
        createdAt: -1,
      })
      .limit(variables.size)
      .skip(variables.page * variables.size)
      .populate('author')
      .exec()
    const totalCount = await RecipeModel.count(q)

    return {
      recipes,
      pagination: {
        page: variables.page,
        size: variables.size,
        totalCount,
        totalPages: Math.ceil(totalCount / variables.size),
        hasNext: variables.page !== Math.ceil(totalCount / variables.size),
      },
    }
  }

  async create(data: RecipeInput, lang: LanguageCode, userId?: string) {
    let authorObjectId
    if (userId) {
      const author = await this.userService.findById(userId)
      authorObjectId = author._id
    }

    let coverImage: Image | undefined = undefined

    const slugAddedId = shortid.generate()

    if (data.coverImage) {
      coverImage = {
        url: await processUpload(data.coverImage, `${data.slug}-${slugAddedId}`, 'recipes'),
      }
    }

    const id = uuid()

    const recipe: Partial<Recipe> = {
      // thumbnail: undefined,
      // video: undefined,
      // tags: undefined,
      publicId: id,
      coverImage,
      title: data.title,
      yield: data.yield,
      timing: {
        totalTime: data.totalTime,
        cookTime: data.cookTime,
        prepTime: data.prepTime,
      },
      slug: `${data.slug}-${slugAddedId}`,
      description: data.description,
      author: authorObjectId,
      instructions: data.instructions.map(instructionInput => ({
        text: instructionInput.text,
        step: instructionInput.step,
      })),
      ingredients: await Promise.all(data.ingredients.map(async ingredientInput => {
        //TODO check weights

        let name
        if (ingredientInput.name) {
          name = ingredientInput.name
        }
        if (!name) throw new Errors.Validation('ingredient name not provided')

        return {
          name,
          amount: ingredientInput.amount,
          description: ingredientInput.description,
          unit: ingredientInput.customUnit,
          weightId: ingredientInput.weightId,
          foodId: ingredientInput.foodId,
        }
      })),
    }

    const createdRecipe = await RecipeModel.create(recipe)

    const savedRecipe = await RecipeModel.findById(createdRecipe._id)
      .populate('author')
      .exec()

    if (!savedRecipe) throw new Errors.System('failed to create the recipe')
    return transformRecipe(savedRecipe, userId)
  }

  async delete(id: string, userId?: string, operatorId?: string) {
    if (!userId && !operatorId) throw new Errors.Forbidden('not allowed')

    const query: any = { publicId: id }
    if (userId) {
      query.author = new mongoose.Schema.Types.ObjectId(userId)
    }
    const { ok } = await RecipeModel.remove(query)
    if (!ok) throw new Errors.System('something went wrong')
    return true
  }

  async update(publicId: string, data: Partial<RecipeInput>, lang: LanguageCode, userId?: string) {
    const recipe = await RecipeModel.findOne({ publicId })
      .populate('author')
      .exec()
    if (!recipe) throw new Errors.NotFound(__('notFound'))

    if (data.title) {
      recipe.title = data.title
    }
    if (data.description) {
      recipe.description = data.description
    }
    if (data.ingredients) {
      recipe.ingredients = data.ingredients.map(ingredient => {
        return {
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.customUnit,
          foodId: ingredient.foodId,
          weightId: ingredient.weightId,
          description: ingredient.description,
        }
      })
    }
    if (data.instructions) {
      recipe.instructions = data.instructions.map(ingredient => {
        return {
          step: ingredient.step,
          text: ingredient.text,
        }
      })
    }
    if (data.coverImage) {
      recipe.coverImage = {
        url: await processUpload(data.coverImage, `${data.slug}-${shortid.generate()}`, 'recipes'),
      }
    }
    if (data.totalTime) {
      recipe.timing = {
        ...recipe.timing,
        totalTime: data.totalTime
      }
    }
    if (data.prepTime) {
      recipe.timing = {
        ...recipe.timing,
        prepTime: data.prepTime
      }
    }
    if (data.cookTime) {
      recipe.timing = {
        ...recipe.timing,
        cookTime: data.cookTime
      }
    }
    if (data.yield) {
      recipe.yield = data.yield
    }
    if (data.slug) {
      const foundRecipeWithTheSameSlug = await RecipeModel.findOne({ publicId: { $ne: publicId }, slug: data.slug })

      if (foundRecipeWithTheSameSlug) throw new Errors.Validation('recipe with the smae slug exists')

      recipe.slug = data.slug
    }
    if (data.tags) {
      recipe.tags = await Promise.all(data.tags.map(async slug => {
        const t = await this.tagService.findBySlug(slug) // TODO we should probably only make one request to db

        return {
          _id: t._id,
          slug: t.slug,
          title: t.title,
          type: t.type,
        }
      }))
    }

    await recipe.save()

    return transformRecipe(recipe, userId, true, lang)
  }

  async tag(recipePublicId: string, tagSlugs: string[], userId: string): Promise<Recipe> {
    return this.update(recipePublicId, {
      tags: tagSlugs,
    }, LanguageCode.en, userId)
  }
}
