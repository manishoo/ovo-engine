/*
 * put-default-foods-on-top.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Food } from '@Types/food'


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

export default function putDefaultFoodsOnTop(foods: Food[]): Food[] {
  foods.filter(p => p.isDefault).map(defaultFood => {
    arrayMove(foods, foods.indexOf(defaultFood), 0)
  })

  return foods
}
