import { FoodModel, FoodSchema } from '../src/models/food.model'
import { LanguageCode } from '../src/types/common'
import { InstanceType } from 'typegoose'

async function separateDescription(food: InstanceType<FoodSchema>) {

  food.name.map(foodName => {
    if (foodName.locale === LanguageCode.en) {
      let split = foodName.text.split(', ')
      let description: string = ''
      split.map((splited, index) => {
        if (index > 0) {
          description += splited
          if (index !== split.length - 1) {
            description += ', '
          }
        }
      })
      food.name = [{ locale: LanguageCode.en, text: split[0] }]
      description != '' ? food.description = [{ locale: LanguageCode.en, text: description }] : ''
    }
  })
  await food.save()
}

async function main() {
  console.log('Script started runing.')

  let foodList = await FoodModel.find()

  if (foodList && foodList.length != 0) {

    await Promise.all(foodList.map(async food => {
      await separateDescription(food)
    }))
  }
}

main().then(() => {
  console.log('Script done running.')
  process.exit(0)
})
