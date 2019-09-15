import { InstanceType } from 'typegoose'
import { FoodModel, FoodSchema } from '../src/models/food.model'
import { LanguageCode, Translation } from '../src/types/common'


async function separateDescription(food: InstanceType<FoodSchema>) {
  let name: Translation[] = []
  let desc: Translation[] = []
  food.name.map(foodName => {
    let split = foodName.text.split(foodName.locale === LanguageCode.en ? ', ' : ' ،')
    let description: string = ''
    split.map((splited, index) => {
      if (index > 0) {
        description += splited
        if (index !== split.length - 1) {
          if (foodName.locale === LanguageCode.en) {
            description += ', '
          } else {
            description += '، '
          }
        }
      }
    })

    name.push({
      text: split[0].trim(),
      verified: foodName.verified,
      locale: foodName.locale
    })
    desc.push({
      text: description.trim(),
      verified: foodName.verified,
      locale: foodName.locale,
    })
  })

  food.name = name
  food.description = desc

  await food.save()
}

export default async function main() {
  console.log('Script started runing.')

  let foodList = await FoodModel.find()

  if (foodList && foodList.length != 0) {

    await Promise.all(foodList.map(async food => {
      await separateDescription(food)
    }))
  }
}
