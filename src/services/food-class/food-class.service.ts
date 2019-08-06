/*
 * food-class.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { FoodClass } from '@Types/food-class'
import { FoodClassModel } from '@Models/food-class.model'
import { Translation } from '@Types/common'


@Service()
export default class FoodClassService {
    async listFoodClasses(page: number, size: number): Promise<FoodClass[]> {

        return FoodClassModel.find()
        .limit(size)
        .skip(size * page)
    }
}
