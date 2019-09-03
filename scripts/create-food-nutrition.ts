import { FoodModel, FoodSchema } from '../src/models/food.model'
import { Nutrition } from '../src/types/food'
import { InstanceType } from 'typegoose'

function getCalories(content: any, nutrition: Nutrition) {
  if (content.content.toString() === '5d4e9f53236bfe3c44a0a341') { //calorie 

    nutrition.calories = {
      id: '5d4e9f53236bfe3c44a0a341',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getFats(content: any, nutrition: Nutrition) {
  if (content.content.toString() === '5d4e9f53236bfe3c44a0a31c') { //fat 

    nutrition.fats = {
      id: '5d4e9f53236bfe3c44a0a31c',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getProteins(content: any, nutrition: Nutrition) {
  if (content.content.toString() === '5d4e9f53236bfe3c44a0a31d') { //protein 

    nutrition.proteins = {
      id: '5d4e9f53236bfe3c44a0a31d',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getCarbs(content: any, nutrition: Nutrition) {
  if (content.content.toString() === '5d4e9f53236bfe3c44a0a31e') { //carbs 

    nutrition.carbs = {
      id: '5d4e9f53236bfe3c44a0a31e',
      amount: content.amount,
      unit: content.unit
    }
  }
}

function getSodium(content: any, nutrition: Nutrition) {
  if (content.content.toString() === '5d4e7dc3a8721d5dd5a13844') { //sodium 

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

async function main() {
  console.log('---> Script started <---')

  let foods = await FoodModel.find()

  if (foods) {
    await Promise.all(foods.map(async food => {

      food = createFoodNutritionObject(food)
      food = await food.save()
      console.log(food.nutrition)

    }))
  }
}

main().then(() => process.exit(0))
