/*
 * tag.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import TagService from '@Services/tag/tag.service'
import { Tag } from '@Types/tag'
import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { Context } from '../utils'


@Service()
@Resolver()
export default class TagResolver {
  constructor(
    // service injection
    private readonly tagService: TagService,
  ) {
    // noop
  }

  @Query(returns => [Tag])
  async tags(
    @Ctx() ctx: Context,
  ): Promise<Tag[]> {
    return this.tagService.list()
  }
}
