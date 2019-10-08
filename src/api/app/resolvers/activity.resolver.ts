/*
 * activity.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import ActivityService from '@Services/activity/activity.service'
import { Activity, ActivityGroup, ActivityInput } from '@Types/activity'
import { Role, TranslationInput } from '@Types/common'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class AssistantResolver {
  constructor(
    // service injection
    private readonly activityService: ActivityService
  ) {
    // noop
  }

  @Authorized(Role.user)
  @Query(returns => [Activity])
  async activities(
    @Ctx() ctc: Context,
  ) {
    return this.activityService.listActivities()
  }

  @Authorized(Role.user)
  @Query(returns => [ActivityGroup])
  async activityGroups(
    @Ctx() ctx: Context,
  ) {
    return this.activityService.listActivityGroups()
  }

  @Authorized(Role.operator)
  @Mutation(returns => Activity)
  async addActivity(
    @Arg('activity') activity: ActivityInput,
    @Ctx() ctx: Context,
  ) {
    return this.activityService.addActivity(activity)
  }

  @Authorized(Role.operator)
  @Mutation(returns => ActivityGroup)
  async addActivityGroup(
    @Arg('name', type => [TranslationInput]) name: TranslationInput[],
    @Arg('slug') slug: string,
    @Ctx() ctx: Context,
  ) {
    return this.activityService.addActivityGroup(slug, name)
  }
}
