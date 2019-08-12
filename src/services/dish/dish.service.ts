/*
 * dish.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { DishModel } from '@Models/dish.model'
import { Dish, DishInput, DishListResponse } from '@Types/dish'
import Errors from '@Utils/errors'
import mongoose from 'mongoose'
import { Service } from 'typedi'


const DEFAULT_PAGE_SIZE = 25

@Service()
export default class DishService {
  async get(id: string): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.UserInput('Invalid id', { id: 'Incorrect id' })

    const dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('Dish not found')

    return dish
  }

  async list(page: number = 1, size: number = DEFAULT_PAGE_SIZE): Promise<DishListResponse> {
    const counts = await DishModel.countDocuments()

    if (page > Math.ceil(counts / size)) page = Math.ceil(counts / size)
    if (page < 1) page = 1

    const dishes = await DishModel.find()
      .limit(size)
      .skip(size * (page - 1))

    return {
      dishes,
      pagination: {
        page,
        size,
        totalCount: counts,
        totalPages: Math.ceil(counts / size),
        hasNext: page !== Math.ceil(counts / size)
      },
    }
  }

  async create(dishInput: DishInput): Promise<Dish> {
    return DishModel.create({
      // TODO incomplete
    })
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('Invalid  id')

    // TODO can only delete own dish

    await DishModel.remove({ _id: mongoose.Types.ObjectId(id) })

    return true
  }

  async update(id: string, dishInput: DishInput): Promise<Dish> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Errors.Validation('Invalid  id')

    const dish = await DishModel.findById(id)
    if (!dish) throw new Errors.NotFound('Dish not found')

    // TODO can only update own dish

    // TODO complete

    return dish
  }
}
