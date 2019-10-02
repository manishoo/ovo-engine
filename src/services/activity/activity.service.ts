/*
 * activity.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import Errors from '@Utils/errors'
import { Service } from 'typedi'
import { ActivityInput, Activity, ActivityGroup } from '@Types/activity'
import { TranslationInput } from '@Types/common'
import { ActivityGroupModel } from '@Models/activity-group.model'
import { ActivityModel } from '@Models/activity.model'


@Service()
export default class ActivityService {
  constructor(
    // service injection
  ) {
    // noop
  }

  async listActivities(): Promise<Activity[]> {

    const activities = await ActivityModel.find()
      .populate('activityGroup')

    return activities
  }

  async listActivityGroups(): Promise<ActivityGroup[]> {

    const activityGroups = await ActivityGroupModel.find()

    return activityGroups
  }

  async addActivity(activity: ActivityInput): Promise<Activity> {

    let acc: Partial<Activity> = {}
    let activityGroup = await ActivityGroupModel.findById(activity.activityGroupId)
    if (!activityGroup) throw new Errors.UserInput('Invalid activity group', { 'activityGroupId': 'ActivityGroup not found' })

    acc.activityTypeName = activity.activityTypeName
    acc.met = activity.met
    acc.activityGroup = activityGroup._id
    if (activity.icon) {
      acc.icon = activity.icon
    }
    let createActivity = await ActivityModel.create(acc)
    createActivity.activityGroup = activityGroup

    return createActivity
  }

  async addActivityGroup(slug: string, name: TranslationInput[]): Promise<ActivityGroup> {
    let query: any = {}
    query['slug'] = slug

    let activityGroup = await ActivityGroupModel.findOne(query)

    if (!activityGroup) {
      activityGroup = new ActivityGroupModel({
        name,
        slug,
      })
      activityGroup = await activityGroup.save()
    }

    return activityGroup
  }
}
