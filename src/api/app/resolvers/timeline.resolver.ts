/*
 * user.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import TimelineService from '@Services/timeline/timeline.service'
import { UserRole } from '@Types/common'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'
import { TimeLine, TimelineResponse } from '@Types/timeline'


@Service()
@Resolver(of => TimeLine)
export default class UserResolver {
  constructor(
    // service injection
    private readonly timelineService: TimelineService
  ) {
    // noop
  }

  @Authorized(UserRole.user)
  @Query(returns => TimelineResponse)
  async timeline(
    @Ctx() ctx: Context,
  ) {
    return this.timelineService.timeline(ctx.user!.id)
  }
}
