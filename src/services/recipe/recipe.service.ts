/*
 * recipe.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { RecipeModel } from '@Models/recipe.model'
import { TagModel } from '@Models/tag.model'
import { UserModel } from '@Models/user.model'
import DietService from '@Services/diet/diet.service'
import UploadService from '@Services/upload/upload.service'
import { Image, LanguageCode, ObjectId, Role } from '@Types/common'
import { Food } from '@Types/food'
import { Ingredient, IngredientInput } from '@Types/ingredient'
import { Instruction, ListRecipesArgs, Recipe, RecipeInput, RecipesListResponse, RecipeStatus } from '@Types/recipe'
import { Author } from '@Types/user'
import { ContextUser } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import { createPagination } from '@Utils/generate-pagination'
import shortid from 'shortid'
import slug from 'slug'
import { Service } from 'typedi'
import { transformRecipe } from './transformers/recipe.transformer'
import { calculateRecipeNutrition } from './utils/calculate-recipe-nutrition'
import MealService from '@Services/meal/meal.service'
import { determineWeightIsObject, determineCustomUnitIsObject, determineRecipeIsObject, determineFoodIsObject } from '@Utils/determine-object'
import { MealItemInput } from '@Types/meal'


@Service()
export default class RecipeService {
  constructor(
    // service injection
    private readonly uploadService: UploadService,
    private readonly dietService: DietService,
    private readonly mealService: MealService,
  ) {
    // noop
  }

  async get(id?: ObjectId, slug?: string) {
    if (!id && !slug) throw new Errors.Validation('Recipe id or slug must be provided')

    const query: { slug?: string, _id?: ObjectId } = {}

    if (id) {
      query._id = id
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

  async list(args: ListRecipesArgs): Promise<RecipesListResponse> {
    if (!args.size) {
      args.size = 10
    }
    if (!args.page) {
      args.page = 1
    }

    let query: any = {
      status: args.status || RecipeStatus.public,
    }

    let sort: any = {
      likes: -1
    }

    if (args.userId) {
      const me = await UserModel.findById(args.userId)
      if (!me) throw new Errors.System('something went wrong')

      query['author'] = args.userId
    }

    if (args.tags) {
      query['tags'] = { $in: args.tags }
    }

    if (args.nameSearchQuery) {
      query['title.text'] = { $regex: args.nameSearchQuery }
    }

    if (args.ingredients) {
      query['ingredients.food._id'] = { $in: args.ingredients }
    }

    if (args.latest) {
      sort['createdAt'] = -1
    }

    if (args.diets) {
      const diets = await Promise.all(args.diets.map(async dietId => this.dietService.get(dietId)))

      query['ingredients.food.foodClass'] = { $not: { $elemMatch: { $not: { $in: await this.dietService.getFoodClassIdsFromDiets(diets) } } } }
    }

    if (args.lastId) {
      const recipe = await RecipeModel.findById(args.lastId)
      if (!recipe) throw new Errors.NotFound('recipe not found')

      query.createdAt = { $lt: recipe.createdAt }
    }

    const totalCount = await RecipeModel.count(query)
    const recipes = await RecipeModel.aggregate([
      {
        $match: query
      },
      {
        $sort: sort,
      },
      {
        $limit: args.size,
      },
      {
        $skip: (args.page - 1) * args.size
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authors'
        }
      }
    ])

    recipes.map(recipe => {
      recipe.author = recipe.authors[0] as Author
      recipe.author.id = recipe.author._id
    })

    return {
      recipes: recipes.map(recipe => transformRecipe(recipe, args.viewerUser ? args.viewerUser.id : undefined)),
      pagination: createPagination(args.page, args.size, totalCount),
    }
  }

  async create(data: RecipeInput, lang: LanguageCode, userId: string): Promise<Recipe> {

    const author = await UserModel.findById(userId)
    if (!author) throw new Errors.NotFound('author not found')

    let image: Image | undefined = undefined
    let thumbnail: Image | undefined = undefined

    const slugAddedId = shortid.generate()
    const generatedSlug = `${slug(data.title[0].text)}-${slugAddedId}`

    if (data.image) {
      image = {
        url: await this.uploadService.processUpload(data.image, `full`, `images/recipes/${generatedSlug}`),
      }

      if (!data.thumbnail) {
        thumbnail = {
          url: await this.uploadService.processUpload(data.image, `thumb`, `images/recipes/${generatedSlug}`),
        }
      }
    }
    if (data.thumbnail) {
      thumbnail = {
        url: await this.uploadService.processUpload(data.thumbnail, `thumb`, `images/recipes/${generatedSlug}`),
      }
    }

    const recipe: Partial<Recipe> = {
      image,
      thumbnail,
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
      languages: data.title.map(name => name.locale),
      ingredients: await Promise.all(data.ingredients.map(this._validateIngredients)),
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

  private async _validateIngredients(ingredientInput: IngredientInput) {
    let ingredient: Partial<Ingredient> = {}

    ingredient.amount = ingredientInput.amount
    ingredient.description = ingredientInput.description

    /**
     * If the ingredient didn't have an associated food or recipe
     * it must have a name, otherwise, it's invalid
     * */
    if (!ingredientInput.food && !ingredientInput.recipe) {
      if (!ingredientInput.name) {
        throw new Errors.UserInput('incomplete data', { 'name': 'either food or name should be entered' })
      }
      ingredient.name = ingredientInput.name
    } else {
      if (ingredientInput.food) {
        /**
         * If the ingredient had an associated food
         * */
        const food = await FoodModel.findById(ingredientInput.food)
        if (!food) throw new Errors.NotFound('food not found')

        ingredient.item = food
      } else {
        /**
         * If the ingredient had an associated recipe
         * */
        const recipe = await RecipeModel.findById(ingredientInput.recipe)
        if (!recipe) throw new Errors.NotFound('recipe not found')

        ingredient.item = recipe
      }

      /**
       * Check and select the unit
       * */
      switch (ingredientInput.unit) {
        case 'customUnit':
          ingredient.unit = ingredientInput.customUnit
          break
        case 'g':
          ingredient.unit = undefined
          break
        default:
          /**
           * If the selected unit was a weightId
           * */
          if (ingredientInput.food) {
            const food = ingredient.item as Food
            const foundWeight = food.weights.find(w => w.id!.toString() == ingredientInput.unit)
            if (!foundWeight) throw new Errors.Validation('Unit is not valid')

            ingredient.unit = foundWeight
          }
      }
    }

    return ingredient as Ingredient
  }

  async delete(id: ObjectId, user: ContextUser) {
    if (!user) throw new Errors.Forbidden('not allowed')
    if (!ObjectId.isValid(id)) throw new Errors.Validation('invalid recipe ID')

    const query: any = { _id: id }
    if (user && (user.role !== Role.operator)) {
      query.author = new ObjectId(user.id)
    }
    const recipe = await RecipeModel.findOne(query)
    if (!recipe) throw new Errors.NotFound('recipe not found')

    const removedRecipe = await recipe.delete(DeleteBy.user(user))
    if (!removedRecipe) throw new Errors.System('something went wrong')

    return removedRecipe.id
  }

  async update(recipeId: ObjectId, data: Partial<RecipeInput>, lang: LanguageCode, user: ContextUser) {
    const query: any = { _id: recipeId }

    /**
     * If you're a User, you can
     * only update your own recipe
     * */
    if (user.role !== Role.operator && user.role !== Role.admin) {
      query['author'] = new ObjectId(user.id)
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
      recipe.languages = data.title.map(name => name.locale)
    }
    if (data.description) {
      recipe.description = data.description
    }
    if (data.difficulty) {
      recipe.difficulty = data.difficulty
    }
    if (data.ingredients) {
      recipe.ingredients = await Promise.all(data.ingredients.map(this._validateIngredients))
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
    if (data.image) {
      recipe.image = {
        url: await this.uploadService.processUpload(data.image, `${data.slug}-${shortid.generate()}`, 'images/recipes'),
      }
    }

    if (data.image) {
      recipe.image = {
        url: await this.uploadService.processUpload(data.image, `full`, `images/recipes/${data.slug}`),
      }

      if (!data.thumbnail) {
        recipe.thumbnail = {
          url: await this.uploadService.processUpload(data.image, `thumb`, `images/recipes/${data.slug}`),
        }
      }
    }
    if (data.thumbnail) {
      recipe.thumbnail = {
        url: await this.uploadService.processUpload(data.thumbnail, `thumb`, `images/recipes/${data.slug}`),
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

    if (data.status) {
      switch (data.status) {
        /**
         * All users can do this
         * */
        case RecipeStatus.private:
        case RecipeStatus.review:
          recipe.status = data.status
          break
        /**
         * Only operators and admins can make a recipe public
         * */
        case RecipeStatus.public:
          if (user.role === Role.operator || user.role === Role.admin) {
            recipe.status = data.status
          }
          break
      }
    }

    let savedRecipe = transformRecipe(await recipe.save(), user && user.id)
    let updatingMeals = await this.mealService.list({ foodOrRecipeId: savedRecipe._id })

    await Promise.all(updatingMeals.meals.map(async meal => {

      const author = meal.author as Author
      await this.mealService.update(meal._id!, {
        ...meal,
        items: [
          ...meal.items.map(mealItem => {

            let unit
            if (mealItem.unit && determineWeightIsObject(mealItem.unit)) {
              unit = mealItem.unit.id!.toString()
            } else if (mealItem.unit && determineCustomUnitIsObject(mealItem.unit)) {
              unit = 'customUnit'
            } else {
              unit = 'g'
            }

            let recipeId
            if (mealItem.item && determineRecipeIsObject(mealItem.item)) {
              recipeId = new ObjectId(mealItem.item.id)
            }
            let foodId
            if (mealItem.item && determineFoodIsObject(mealItem.item)) {
              foodId = new ObjectId(mealItem.item.id)
            }
            let baseMealItem: Partial<MealItemInput> = {
              id: mealItem.id,
              name: mealItem.name,
              amount: mealItem.amount,
              unit: unit,
              customUnit: mealItem.customUnit,
              description: mealItem.description,
              isOptional: mealItem.isOptional,
              food: foodId,
            }

            if (mealItem.item!.id === savedRecipe.id) {
              return {
                ...baseMealItem,
                recipe: new ObjectId(savedRecipe.id)
              } as MealItemInput
            } else {
              return {
                ...baseMealItem,
                recipe: recipeId
              } as MealItemInput
            }
          })
        ]
      }, author.id!)
    }))

    return savedRecipe
  }

  async tag(recipePublicId: ObjectId, tagSlugs: string[], user: ContextUser): Promise<Recipe> {
    return this.update(recipePublicId, {}, LanguageCode.en, user)
  }
}
