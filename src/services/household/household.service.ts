/*
 * household.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { HouseholdModel } from '@Models/household.model'
import { Household } from '@Types/household'
import { Service } from 'typedi'


@Service()
export default class HouseholdService {
  async create(data: Household) {
    try {
      const newHousehold = new HouseholdModel(data)
      return newHousehold.save()
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
