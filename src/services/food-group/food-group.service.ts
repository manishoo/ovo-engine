/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { FoodGroup, FoodGroupInput, ParentFoodGroup } from '@Types/food-group'
import { FoodGroupModel } from '@Models/food-group.model'
import { Translation } from '@Types/common'
import Errors from '@Utils/errors'
import monngoose from 'mongoose'


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

    async removeFoodGroup(foodGroupID: string): Promise<Boolean> {
        const { n } = await FoodGroupModel.deleteOne({ _id: new monngoose.Types.ObjectId(foodGroupID) })
        if (n === 0) throw new Errors.NotFound('food group not found')

        return n === 1
    }

    async editFoodGroup(foodGroup: FoodGroupInput): Promise<ParentFoodGroup | null> {
        const editingFoodGroup = await FoodGroupModel.findById(foodGroup.id)
        if(!editingFoodGroup) throw new Errors.NotFound('food group not found')

        const editingFoodGroupSubGroups = await FoodGroupModel.find({parentFoodGroup: foodGroup.id})
        
        editingFoodGroup.name = foodGroup.name

        // If user deleted a subgroup
        Promise.all(editingFoodGroupSubGroups.map(async fg => {
            const found = foodGroup.subGroups.find(sg => sg.id === String(fg.id))
            if (!found) {
                await fg.remove()
            }
        }))

        // If user added a subgroup
        Promise.all(foodGroup.subGroups.map(async fg => {
            const found = editingFoodGroupSubGroups.find(sg => String(sg.id) === fg.id)

            if (!found) {
                await this.addFoodGroup(fg.name, foodGroup.id)
            }
        }))

        const foodGroupSubGroups = await FoodGroupModel.find({parentFoodGroup: foodGroup.id})

        const result = await editingFoodGroup.save()

        return {
            id: result.id,
            name: result.name,
            subGroups: foodGroupSubGroups,
        }
    }
}
