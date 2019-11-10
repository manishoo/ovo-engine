/*
 * meal-plan.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { MealPlanModel } from '@Models/meal-plan.model'
import UserService from '@Services/user/user.service'
import { MealPlan } from '@Types/meal-plan'
import { Service } from 'typedi'


@Service()
export default class MealPlanService {
  constructor(
    // service injection
    private readonly userService: UserService
  ) {
    // noop
  }

  async create(data: MealPlan) {
    try {
      const newPlan = new MealPlanModel(data)
      return newPlan.save()
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
