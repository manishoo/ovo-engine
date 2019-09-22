import { FoodModel, FoodSchema } from '@Models/food.model'
import { Nutrition } from '@Types/food'
import { InstanceType } from 'typegoose'


function getCalories(content: any, nutrition: Nutrition) {
  if (content.origContentName.toString() === 'Energy') {

    nutrition.calories = {
      id: '5d4e9f53236bfe3c44a0a341',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getFats(content: any, nutrition: Nutrition) {
  if (content.origContentName.toString() === 'Fat') {

    nutrition.fats = {
      id: '5d4e9f53236bfe3c44a0a31c',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getProteins(content: any, nutrition: Nutrition) {
  if (content.origContentName.toString() === 'Proteins') {

    nutrition.proteins = {
      id: '5d4e9f53236bfe3c44a0a31d',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getCarbs(content: any, nutrition: Nutrition) {
  if (content.origContentName.toString() === 'Carbohydrate') {

    nutrition.carbs = {
      id: '5d4e9f53236bfe3c44a0a31e',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getSodium(content: any, nutrition: Nutrition) {
  if (content.origContentName.toString() === 'Sodium') {

    nutrition.sodium = {
      id: '5d4e7dc3a8721d5dd5a13844',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function createFoodNutritionObject(food: InstanceType<FoodSchema>): InstanceType<FoodSchema> {
  let nutrition: Partial<Nutrition> = {}
  if (food.nutrition) {
    nutrition = {
      ...food.nutrition
    }
  }
  if (food.contents) {
    food.contents.map(content => {

      getCalories(content, nutrition)
      getFats(content, nutrition)
      getProteins(content, nutrition)
      getCarbs(content, nutrition)
      getSodium(content, nutrition)

    })
  }
  if (nutrition != {}) {
    food.nutrition = nutrition
  }
  return food
}

export default async function main() {
  console.log('Script started.')

  let foods = await FoodModel.find()

  if (foods) {
    await Promise.all(foods.map(async food => {

      food = createFoodNutritionObject(food)
      food = await food.save()
    }))
  }
}