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
import { LogActivityInput } from '@Types/calendar'


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
    let creatingActivity: Partial<Activity> = {}
    let activityGroup = await ActivityGroupModel.findById(activity.activityGroupId)
    if (!activityGroup) throw new Errors.UserInput('Invalid activity group', { 'activityGroupId': 'ActivityGroup not found' })

    creatingActivity.activityTypeName = activity.activityTypeName
    creatingActivity.met = activity.met
    creatingActivity.activityGroup = activityGroup._id
    if (activity.icon) {
      creatingActivity.icon = activity.icon
    }
    let createActivity = await ActivityModel.create(creatingActivity)
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

  async getActivity(activityId: string) {
    const activity = await ActivityModel.findById(activityId)
      .populate('activityGroup')

    if (!activity) throw new Errors.NotFound('Activity not found')

    return activity
  }
}
