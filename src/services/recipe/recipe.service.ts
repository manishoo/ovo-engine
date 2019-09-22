/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { TagModel } from '@Models/tag.model'
import { UserModel } from '@Models/user.model'
import UploadService from '@Services/upload/upload.service'
import { Image, LanguageCode, UserRole } from '@Types/common'
import { Ingredient, Instruction, ListRecipesArgs, Recipe, RecipeInput, RecipesListResponse } from '@Types/recipe'
import { ContextUser } from '@Utils/context'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import mongoose from 'mongoose'
import shortid from 'shortid'
import slug from 'slug'
import { Service } from 'typedi'
import { transformRecipe } from './transformers/recipe.transformer'
import { calculateRecipeNutrition } from './utils/calculate-recipe-nutrition'


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

    return transformRecipe(recipe)
  }

  async list(variables: ListRecipesArgs): Promise<RecipesListResponse> {
    if (!variables.size) {
      variables.size = 10
    }
    if (!variables.page) {
      variables.page = 1
    }

    const query: any = {}

    if (variables.userId) {
      const me = await UserModel.findById(variables.userId)
      if (!me) throw new Errors.System('something went wrong')

      query['author'] = mongoose.Types.ObjectId(variables.userId)
    }

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
    const totalCount = await RecipeModel.count(query)

    return {
      recipes: recipes.map(recipe => transformRecipe(recipe, variables.viewerUser ? variables.viewerUser.id : undefined)),
      pagination: createPagination(variables.page, variables.size, totalCount),
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

        if (!ingredientInput.food) {
          /**
           * If the ingredient didn't have an associated food
           * */
          if (!ingredientInput.name) {
            throw new Errors.UserInput('incomplete data', { 'name': 'either food or name should be entered' })
          }
          ingredient.name = ingredientInput.name
        } else {
          /**
           * If the ingredient had an associated food
           * */
          if (!mongoose.Types.ObjectId.isValid(ingredientInput.food)) throw new Errors.Validation('invalid food id')
          const food = await FoodModel.findById(ingredientInput.food)
          if (!food) throw new Errors.NotFound('food not found')

          ingredient.food = food
          ingredient.thumbnail = food.thumbnailUrl
          ingredient.name = food.name

          if (ingredientInput.weight) {
            const foundWeight = food.weights.find(w => w.id!.toString() == ingredientInput.weight)
            if (!foundWeight) throw new Errors.Validation('Weight is not valid')

            ingredient.weight = foundWeight
          } else {
            ingredient.gramWeight = ingredientInput.gramWeight
            ingredient.customUnit = ingredientInput.customUnit
          }
        }

        ingredient.amount = ingredientInput.amount
        ingredient.description = ingredientInput.description

        return <Ingredient>ingredient
      })),
    }
    if (data.tags) {
      let tags: any = []
      await Promise.all(data.tags.map(async tag => {
        let validatedTag = await TagModel.findOne({ slug: tag })
        if (!validatedTag) throw new Errors.NotFound('Tag not found')

        tags.push(tag)
      }))

      recipe.tags = tags
    }
    recipe.nutrition = calculateRecipeNutrition(recipe.ingredients!)

    let createdRecipe = await RecipeModel.create(recipe)
    createdRecipe.author = author

    return transformRecipe(createdRecipe, userId)
  }

  async delete(id: string, user?: ContextUser, operatorId?: string) {
    if (!user && !operatorId) throw new Errors.Forbidden('not allowed')
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('invalid recipe ID')

    const query: any = { _id: id }
    if (user && (user.role !== UserRole.operator)) {
      query.author = mongoose.Types.ObjectId(user.id)
    }
    const recipe = await RecipeModel.findOne(query)
    if (!recipe) throw new Errors.NotFound('recipe not found')

    const removedRecipe = await recipe.remove()
    if (!removedRecipe) throw new Errors.System('something went wrong')

    return removedRecipe.id
  }

  async update(recipeId: string, data: Partial<RecipeInput>, lang: LanguageCode, user: ContextUser) {
    const query: any = { _id: recipeId }

    if (user.role !== UserRole.operator) {
      query['author'] = mongoose.Types.ObjectId(user.id)
    }

    const recipe = await RecipeModel.findOne(query)
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
      recipe.ingredients = await Promise.all(data.ingredients.map(async ingredient => {
        let food = await FoodModel.findById(ingredient.food)
        if (!food) throw new Errors.System('Something went wrong')

        return {
          name: ingredient.name,
          amount: ingredient.amount,
          customUnit: ingredient.customUnit,
          gramWeight: ingredient.gramWeight,
          thumbnail: ingredient.thumbnail || food.thumbnailUrl,
          description: ingredient.description,
          food: food,
          weight: food.weights.find(w => w.id == ingredient.weight),
        }
      }))
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
        let validatedTag = await TagModel.findOne({ slug: tag })
        if (!validatedTag) throw new Errors.NotFound('Tag not found')

        tags.push(tag)
      }))

      recipe.tags = tags
    }
    recipe.nutrition = calculateRecipeNutrition(recipe.ingredients)

    return transformRecipe(await recipe.save(), user && user.id)
  }

  async tag(recipePublicId: string, tagSlugs: string[], user: ContextUser): Promise<Recipe> {
    return this.update(recipePublicId, {}, LanguageCode.en, user)
  }
}
