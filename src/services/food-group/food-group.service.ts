/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { FoodGroup } from '@Types/food-group'
import { FoodGroupModel } from '@Models/food-group.model'
import { Translation } from '@Types/common'


@Service()
export default class FoodGroupService {
    async listFoodGroups(): Promise<FoodGroup[]> {
        return FoodGroupModel.find({ parentFoodGroup: { $eq: null }})
    }

    async addFoodGroup(name: Translation[], parentFoodGroup?: string): Promise<FoodGroup> {
        return FoodGroupModel.create(<FoodGroup> {
            name,
            parentFoodGroup,
        })
    }
}
