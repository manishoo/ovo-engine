/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { FoodGroup, ParentFoodGroup } from '@Types/food-group'
import { FoodGroupModel } from '@Models/food-group.model'
import { Translation } from '@Types/common'
import Errors from '@Utils/errors'


@Service()
export default class FoodGroupService {
    async listFoodGroups(): Promise<ParentFoodGroup[]> {
        const foodGroups = await FoodGroupModel.find()

        return foodGroups.filter(fg => !fg.parentFoodGroup)
            .map(rootFoodGroup => {
                return {
                    id: rootFoodGroup.id,
                    name: rootFoodGroup.name,
                    subGroups: foodGroups.filter(fg => String(fg.parentFoodGroup) === String(rootFoodGroup.id))
                } as ParentFoodGroup
            })
    }

    async addFoodGroup(name: Translation[], parentFoodGroup?: string): Promise<FoodGroup> {
        return FoodGroupModel.create(<FoodGroup>{
            name,
            parentFoodGroup,
        })
    }

    async removeFoodGroup(foodGroupID: string): Promise<FoodGroup> {
        const { removingFoodGroup } = await FoodGroupModel.remove(foodGroupID)
        if (removingFoodGroup.deletedCount !== 0) throw new Errors.NotFound('food group not found')

        return removingFoodGroup
    }
}
