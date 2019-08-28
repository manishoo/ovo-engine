/*
 * timeline.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Service } from 'typedi'
import { TimelineResponse, TimelineMealType, TimeLine, TimelineMeal } from '@Types/timeline'
import { TimelineModel } from '@Models/timeline.model'
import mongoose, { mongo } from 'mongoose'
import { createPagination } from '@Utils/generate-pagination'
import { DishModel } from '@Models/dish.model';

@Service()
export default class TimelineService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async timeline(userId: string): Promise<TimelineResponse> {

    let query: any = {}
    let day: Partial<TimeLine> = {}

    query.user = new mongoose.Schema.Types.ObjectId(userId)

    query.user = mongoose.Types.ObjectId(userId)
    const timeline = await TimelineModel.find(query)

    return {
      timeline,
      pagination: createPagination(1, 30, 30)
    }

  }
}
