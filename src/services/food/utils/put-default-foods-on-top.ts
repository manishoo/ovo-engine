/*
 * put-default-foods-on-top.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food } from '@Types/food'
import { FoodClass } from '@Types/food-class'


/**
 * A function that gets an array of foods and rearranges them
 * and puts the default food in a continuous list of foods on
 * top
 * */
export default function putDefaultFoodsOnTop(origFoods: Food[]): Food[] {
  const foodsArrayObj: { [k: string]: any[] } = {}
  // cut big array into smaller arrays based on food class
  origFoods.forEach(food => {
    if (foodsArrayObj[(food.foodClass as FoodClass).id]) {
      foodsArrayObj[(food.foodClass as FoodClass).id].push(food)
    } else {
      foodsArrayObj[(food.foodClass as FoodClass).id] = [food]
    }
  })

  const finalFoods: Food[] = []
  // move default (if any) on top of them
  Object.keys(foodsArrayObj).forEach(foodClassId => {
    const foods = foodsArrayObj[foodClassId]

    foods.filter(p => p.isDefault).map(defaultFood => {
      arrayMove(foods, foods.indexOf(defaultFood), 0)
    })

    finalFoods.push(...foods)
  })
  return finalFoods
}

function arrayMove(arr: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}
