/*
 * language.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MacroNutrientDistribution } from '@Types/assistant'
import { Food } from '@Types/food'
import { Recipe } from '@Types/recipe'
import { ActivityLevel, Gender, Goal, Height, HeightUnits, WeightUnits, WeightUnit } from '@Types/user'


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

    const foundUnit = Object.keys(WeightUnits).find(i => i === data.unit)
    if (foundUnit) {
      return {
        value: +data.value,
        unit: <WeightUnits>foundUnit
      }
    } else {
      throw Error('unit unacceptable')
    }
  },
  extractHeight(data: any): Height {
    if (!data) throw Error()

    const foundUnit = Object.keys(HeightUnits).find(i => i === data.unit)
    if (foundUnit) {
      return {
        value: +data.value,
        unit: <HeightUnits>foundUnit
      }
    } else {
      throw Error('unit unacceptable')
    }
  },
  async extractGender(text: string): Promise<string> {
    let g
    Object.keys(Gender).map((key: any) => {
      if (Gender[key] === text.replace(/[👱‍♀️‍♂️]/g, '')) {
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
    Object.keys(ActivityLevel).map((key: string) => {
      // @ts-ignore
      if (ActivityLevel[key] === text.replace(/[🏋‍♂️‍♀️🏃🚶🛋🔥]/g, '')) {
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
    Object.keys(Goal).map((key: string) => {
      // @ts-ignore
      if (Goal[key] === text) {
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
