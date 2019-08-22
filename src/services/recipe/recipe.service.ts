/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { UserModel } from '@Models/user.model'
import TagService from '@Services/tag/tag.service'
import UploadService from '@Services/upload/upload.service'
import { Image, LanguageCode } from '@Types/common'
import { Ingredient, ListRecipesArgs, Recipe, RecipeInput, Instruction, RecipesListResponse } from '@Types/recipe'
import Errors from '@Utils/errors'
import { __ } from 'i18n'
import mongoose from 'mongoose'
import shortid from 'shortid'
import slug from 'slug'
import { Service } from 'typedi'
import { TagModel } from '@Models/tag.model'
import { transformRecipe } from './transformers/recipe.transformer'


@Service()
export default class RecipeService {
  constructor(
    // service injection
    private readonly uploadService: UploadService,
  ) {
    // noop
  }

  async get(id?: string, slug?: string) {
    if (!id && !slug) throw new Errors.Validation('Recipe id or slug must be provided')

    const query: { slug?: string, _id?: mongoose.Types.ObjectId } = {}

    if (id) {
      query._id = mongoose.Types.ObjectId(id)
    }
    if (slug) {
      query.slug = slug
    }

    const recipe = await RecipeModel.findOne(query)
      .populate('author')
      .exec()

    if (!recipe) throw new Errors.NotFound('Recipe not found')

    return recipe
  }

  async list(variables: ListRecipesArgs = { page: 1, size: 10 }): Promise<RecipesListResponse> {
    const query: any = {}
    const me = await UserModel.findById(variables.userId)
    if (!me) throw new Errors.System('something went wrong')

    if (variables.tags) {
      query['tags'] = { $in: variables.tags }
    }

    if (variables.nameSearchQuery) {
      query['title.text'] = { $regex: variables.nameSearchQuery, $options: 'i' }
    }

    if (variables.lastId) {
      if (!mongoose.Types.ObjectId.isValid(variables.lastId)) throw new Errors.Validation('LastId is not valid')

      const recipe = await RecipeModel.findById(variables.lastId)
      if (!recipe) throw new Errors.NotFound('recipe not found')

      query.createdAt = { $lt: recipe.createdAt }
    }
    const recipes = await RecipeModel.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(variables.size)
      .skip((variables.page - 1) * variables.size)
      .populate('author')
      .exec()
    recipes.map(recipe => {
      transformRecipe(recipe, me._id.toString())
    })
    const totalCount = await RecipeModel.count(query)

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

  async create(data: RecipeInput, lang: LanguageCode, userId: string): Promise<Recipe> {

    const author = await UserModel.findById(userId)
    if (!author) throw new Errors.NotFound('author not found')

    let coverImage: Image | undefined = undefined

    const slugAddedId = shortid.generate()
    const generatedSlug = `${slug(data.title[0].text)}-${slugAddedId}`
    if (data.coverImage) {
      coverImage = {
        url: await this.uploadService.processUpload(data.coverImage, `${generatedSlug}`, 'recipes'),
      }
    }

    const recipe: Partial<Recipe> = {
      coverImage,
      title: data.title,
      serving: data.serving,
      timing: {
        totalTime: data.timing.totalTime,
        cookTime: data.timing.cookTime,
        prepTime: data.timing.prepTime,
      },
      slug: `${generatedSlug}`,
      description: data.description,
      author: author._id,
      instructions: data.instructions.map(instructionInput => ({
        text: instructionInput.text,
        step: instructionInput.step,
      })),
      ingredients: await Promise.all(data.ingredients.map(async ingredientInput => {
        let ingredient: Partial<Ingredient> = {}
        if (ingredientInput.weight) {
          ingredient.weight = mongoose.Types.ObjectId(ingredientInput.weight)
        } else {
          if (!ingredientInput.customUnit || !ingredientInput.gramWeight) {
            throw new Errors.UserInput('incomplete data', {
              'customUnit': 'custom unit is mandatory',
              'gramWeight': 'gram weight is mandatory'
            })
          }
          ingredient.gramWeight = ingredientInput.gramWeight
          ingredient.customUnit = ingredientInput.customUnit
        }

        if (!ingredientInput.food) {
          if (!ingredientInput.name) {
            throw new Errors.UserInput('incomplete data', { 'name': 'either food or name should be entered' })
          }
          ingredient.name = ingredientInput.name
        } else {
          if (!mongoose.Types.ObjectId.isValid(ingredientInput.food)) throw new Errors.Validation('invalid food id')
          const food = await FoodModel.findById(ingredientInput.food)
          if (!food) throw new Errors.NotFound('food not found')

          ingredient.food = mongoose.Types.ObjectId(ingredientInput.food)
          ingredient.name = food.name
        }
        ingredient.amount = ingredientInput.amount
        ingredient.description = ingredientInput.description

        return <Ingredient>ingredient
      })),
    }
    let createdRecipe = await RecipeModel.create(recipe)
    createdRecipe.author = author
    return createdRecipe
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

  async update(recipeId: string, data: Partial<RecipeInput>, lang: LanguageCode, userId?: string) {
    const recipe = await RecipeModel.findOne({ _id: recipeId })
      .populate('author')
      .exec()
    if (!recipe) throw new Errors.NotFound('recipe not found')

    if (data.slug) {
      const foundRecipeWithTheSameSlug = await RecipeModel.findOne({ _id: { $ne: recipeId }, slug: data.slug })

      if (foundRecipeWithTheSameSlug) throw new Errors.Validation('recipe with the same slug exists')

      recipe.slug = data.slug
    }
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
          customUnit: ingredient.customUnit,
          gramWeight: ingredient.gramWeight,
          description: ingredient.description,
          food: mongoose.Types.ObjectId(ingredient.food),
          weight: mongoose.Types.ObjectId(ingredient.weight),
          thumbnail: ingredient.thumbnail,
        }
      })
    }
    if (data.instructions) {
      recipe.instructions = await Promise.all(data.instructions.map(async instructionInput => {
        let instruction: Partial<Instruction> = {}
        if (instructionInput.image) {
          instruction.image = {
            url: await this.uploadService.processUpload(instructionInput.image, 'full', `images/recipes/${recipe._id}/instructions/${(instructionInput.step).toString()}`)
          }
        }
        instruction.step = instructionInput.step
        instruction.text = instructionInput.text
        instruction.notes = instructionInput.note
        return <Instruction>instruction
      }))
    }
    if (data.coverImage) {
      recipe.coverImage = {
        url: await this.uploadService.processUpload(data.coverImage, `${data.slug}-${shortid.generate()}`, 'recipes'),
      }
    }
    if (data.timing) {
      recipe.timing = {
        totalTime: data.timing.totalTime,
        cookTime: data.timing.cookTime,
        prepTime: data.timing.prepTime
      }
    }
    if (data.serving) {
      recipe.serving = data.serving
    }

    if (data.tags) {

      let tags: any = []
      await Promise.all(data.tags.map(async tag => {
        if (!mongoose.Types.ObjectId.isValid(tag)) throw new Errors.Validation('invalid tag id')
        let validateTag = await TagModel.findById(tag)
        if (!validateTag) throw new Errors.NotFound('tag not found')

        tags.push(tag)
      }))

      recipe.tags = tags

    }
    transformRecipe(recipe, userId)

    return recipe.save()
  }

  async tag(recipePublicId: string, tagSlugs: string[], userId: string): Promise<Recipe> {
    return this.update(recipePublicId, {
    }, LanguageCode.en, userId)
  }
}
