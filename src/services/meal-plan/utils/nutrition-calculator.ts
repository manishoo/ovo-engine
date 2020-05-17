/*
 * nutrition-calculator.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import config from '@Config'
import { Goal } from '@Types/user'


export default {
  calculateBMR(
    height: number, // cm
    weight: number, // kg
    age: number, // year
    gender: string,
  ): number {
    // Mifflin-St Jeor equation
    const baseBMR = 10 * weight + 6.25 * height - 5 * age

    if (gender === 'male') {
      return Math.round(baseBMR + 5)
    } else {
      // Both female and other gender
      return Math.round(baseBMR - 161)
    }
  },

  calculateTDEE(BMR: number, activity: string): number {
    switch (activity) {
      case 'sed':
        return Math.round(BMR * 1.2)
      case 'light':
        return Math.round(BMR * 1.375)
      case 'mod':
        return Math.round(BMR * 1.55)
      case 'high':
        return Math.round(BMR * 1.725)
      case 'extreme':
        return Math.round(BMR * 1.9)
      default:
        throw Error('No activity provided')
    }
  },

  calculateGoal(goal: string, TDEE: number): number {
    switch (goal) {
      case Goal.ml:
        return TDEE * .85
      case Goal.sl:
        return TDEE * .80
      case Goal.il:
        return TDEE * .75
      case Goal.mg:
        return TDEE * 1.05
      case Goal.sg:
        return TDEE * 1.10
      case Goal.ig:
        return TDEE * 1.15
      case Goal.m:
      default:
        return TDEE
    }
  },

  calculateMacros(
    TDEE: number,
    carbs: number = config.constants.defaultMacroNutrientRatio.carbs,
    fat: number = config.constants.defaultMacroNutrientRatio.fat,
    protein: number = config.constants.defaultMacroNutrientRatio.protein
  ) {
    const sum = carbs + fat + protein
    if (sum !== 100) {
      throw Error('Sum is not 100')
    }

    return {
      carbs: ((carbs / 100) * TDEE) / 4,
      fat: ((fat / 100) * TDEE) / 9,
      protein: ((protein / 100) * TDEE) / 4,
    }
  },
}
