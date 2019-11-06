/*
 * user.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import dotenv from 'dotenv'
import { NutritionProfile } from '@Types/user'


dotenv.config()

const defaultNutritionProfile: NutritionProfile = {
  isStrict: false,
  calories: 2000,
  carb: {
    max: 250,
    min: 200,
    get average(): number {
      return this.max + this.min / 2
    }
  },
  fat: {
    max: 90,
    min: 80,
    get average(): number {
      return this.max + this.min / 2
    }
  },
  protein: {
    max: 170,
    min: 150,
    get average(): number {
      return this.max + this.min / 2
    }
  },
}

export default {
  defaultNutritionProfile,
}
