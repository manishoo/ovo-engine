/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { FoodGroup } from '@Types/food-group'
import { FoodGroupModel } from '@Models/food-group.model'


@Service()
export default class FoodGroupService {
    async listFoodGroups(): Promise<FoodGroup[]> {
        return FoodGroupModel.find()
    }
}
