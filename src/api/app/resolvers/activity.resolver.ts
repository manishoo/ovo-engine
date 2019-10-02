/*
 * assistant.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Ctx, Resolver, Authorized, Query, Mutation, Arg } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '@Utils/context'
import { UserRole, LanguageCode, TranslationInput } from '@Types/common'
import { Activity, ActivityInput, ActivityGroup } from '@Types/activity'
import ActivityService from '@Services/activity/activity.service'



@Service()
@Resolver()
export default class AssistantResolver {
  constructor(
    // service injection
    private readonly activityService: ActivityService
  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Query(returns => [Activity])
  async activities(
    @Ctx() ctc: Context,
  ) {
    return this.activityService.listActivities()
  }

  @Authorized(UserRole.user)
  @Query(returns => [ActivityGroup])
  async activityGroups(
    @Ctx() ctx: Context,
  ) {
    return this.activityService.listActivityGroups()
  }

  @Authorized(UserRole.user)
  @Mutation(returns => Activity)
  async addActivity(
    @Arg('activity') activity: ActivityInput,
    @Ctx() ctx: Context,
  ) {
    return this.activityService.addActivity(activity)
  }

  @Authorized(UserRole.user)
  @Mutation(returns => ActivityGroup)
  async addActivityGroup(
    @Arg('name', type => [TranslationInput]) name: TranslationInput[],
    @Arg('slug') slug: string,
    @Ctx() ctx: Context,
  ) {
    return this.activityService.addActivityGroup(slug, name)
  }
}
