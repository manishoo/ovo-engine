/*
 * generate-avatar-url.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { GENDER } from '@Types/user'


function getRandomFromArray(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateAvatarUrl(username: string, gender?: GENDER): string {
  let tops = []
  let hairColors = ['black', 'brown', 'blonde', 'auburn']
  let clothes = ['blazer', 'sweater', 'shirt', 'hoodie', 'overall']
  let clothesColor = ['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white']
  let eyes = ['defaultValue', 'happy', 'hearts']
  let brows = ['defaultValue', 'raised', 'up']
  let mouths = ['defaultValue', 'eating', 'twinkle', 'smile', 'eating', 'eating', 'eating']

  if (gender == GENDER.female) {
    tops = ['longHair']
  } else if (gender == GENDER.male) {
    tops = ['shortHair']
  } else {
    tops = ['hat']
  }

  // let avatars = new Avatars(sprites({
  // 	mode: 'include',
  // 	style: 'transparent',
  // 	accessoriesChance: 0,
  // 	topChance: 100,
  // 	facialHairChance: 0,
  // 	skin: 'pale',
  // 	hairColor: getRandomFromArray(hairColors),
  // 	top: getRandomFromArray(tops),
  // 	clothes: getRandomFromArray(clothes),
  // 	clothesColor: getRandomFromArray(clothesColor),
  // 	eyebrow: getRandomFromArray(brows),
  // 	eyes: getRandomFromArray(eyes),
  // 	mouth: getRandomFromArray(mouths),
  // }))
  return `https://avatars.dicebear.com/v2/avataaars/${username}.svg?options[mode]=include&options[style]=circle&options[accessoriesChance]=0&options[topChance]=100&options[facialHairChance]=0&options[skin][]=pale&options[hairColor][]=${getRandomFromArray(hairColors)}&options[top][]=${getRandomFromArray(tops)}&options[clothes][]=${getRandomFromArray(clothes)}&options[clothesColor][]=${getRandomFromArray(clothesColor)}&options[eyebrow][]=${getRandomFromArray(brows)}&options[eyes][]=${getRandomFromArray(eyes)}&options[mouth][]=${getRandomFromArray(mouths)}`
}

