/*
 * food.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import UserService from '@Services/user/user.service'
import { Food } from '@Types/food'
import { Service } from 'typedi'


@Service()
export default class FoodService {
	constructor(
		// service injection
		private readonly userService: UserService,
	) {
		// noop
    }
    async listFoods(page: number, size: number): Promise<Food[]>{

        return FoodModel.find()
        .limit(size)
        .skip(size * page)
        .sort('-date')

    }
    
}
