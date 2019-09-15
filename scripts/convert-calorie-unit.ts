import { FoodModel, FoodSchema } from '../src/models/food.model'
import { InstanceType } from 'typegoose'


async function convertCalorieUnit(food: InstanceType<FoodSchema>) {
  if (food.nutrition.calories && food.nutrition.calories.unit == 'kJ') {
    let kjCalorie = food.nutrition.calories.amount

    food.nutrition = {
      ...food.nutrition,
      calories: {
        amount: kjCalorie / 4.18,
        unit: 'kcal',
      }
    }

    await food.save()
    console.log(food.id)
  }
}

export default async function main() {
  console.log('Script started running.')

  let foodList = await FoodModel.find()

  await Promise.all(foodList.map(async food => {
    await convertCalorieUnit(food)
  }))
}
