/*
 * language.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MacroNutrientDistribution } from '@Types/assistant'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { ACTIVITY, GENDER, GOALS, Height, HEIGHT_UNITS, WEIGHT_UNITS, WeightUnit } from '@Types/user'


export default {
  extractNickname(text: string): string {
    return text
  },
  async extractAge(text: string): Promise<number> {
    if (text.match(/\d/)) {
      return Number(text)
    } else {
      throw Error()
    }
  },
  extractWeight(data: any): WeightUnit {
    if (!data) throw Error()

    const foundUnit = Object.keys(WEIGHT_UNITS).find(i => i === data.unit)
    if (foundUnit) {
      return {
        value: +data.value,
        unit: <WEIGHT_UNITS>foundUnit
      }
    } else {
      throw Error('unit unacceptable')
    }
  },
  extractHeight(data: any): Height {
    if (!data) throw Error()

    const foundUnit = Object.keys(HEIGHT_UNITS).find(i => i === data.unit)
    if (foundUnit) {
      return {
        value: +data.value,
        unit: <HEIGHT_UNITS>foundUnit
      }
    } else {
      throw Error('unit unacceptable')
    }
  },
  async extractGender(text: string): Promise<string> {
    let g
    Object.keys(GENDER).map((key: any) => {
      if (GENDER[key] === text.replace(/[👱‍♀️‍♂️]/g, '')) {
        g = key
      }
    })
    if (!g) {
      throw Error()
    }
    return g
  },
  async extractActivity(text: string): Promise<string> {
    // one of enum
    let g
    Object.keys(ACTIVITY).map((key: string) => {
      // @ts-ignore
      if (ACTIVITY[key] === text.replace(/[🏋‍♂️‍♀️🏃🚶🛋🔥]/g, '')) {
        // @ts-ignore
        g = key
      }
    })
    if (!g) {
      throw Error()
    }
    return g
  },
  async extractGoals(text: string): Promise<string> {
    let g
    Object.keys(GOALS).map((key: string) => {
      // @ts-ignore
      if (GOALS[key] === text) {
        // @ts-ignore
        g = key
      }
    })
    if (!g) {
      throw Error()
    }
    return g
  },
  async extractFoodAllergies(text: string): Promise<string> {
    return ''
  },
  async extractDiet(text: string): Promise<string> {
    return ''
  },
  async extractDislikedFoods(text: string): Promise<string> {
    return ''
  },
  async extractFoods(text: string): Promise<{ foods: Food[], recipes: Recipe[] }> {
    return {
      foods: [],
      recipes: [],
    }
  },
  extractMealPlanSettings(data: any): MacroNutrientDistribution {
    if (data.mealPlanSettings) {
      return data.mealPlanSettings
    }

    throw Error()
  },
}
