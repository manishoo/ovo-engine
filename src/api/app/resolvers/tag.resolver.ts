/*
 * tag.resolver.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import TagService from '@Services/tag/tag.service'
import { Tag, TagInput } from '@Types/tag'
import { Context } from '@Utils/context'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'


@Service()
@Resolver()
export default class TagResolver {
  constructor(
    // service injection
    private readonly tagService: TagService,
  ) {
    // noop
  }

  @Authorized()
  @Query(returns => [Tag])
  async tags(
    @Ctx() ctx: Context,
  ) {
    return this.tagService.list()
  }

  @Authorized()
  @Mutation(returns => Tag)
  async addTag(
    @Arg('tag') tagData: TagInput,
    @Ctx() ctx: Context,
  ) {
    return this.tagService.create(tagData, ctx.user!)
  }

  @Authorized()
  @Mutation(returns => String)
  async deleteTag(
    @Arg('tagSlug') tagSlug: string,
    @Ctx() ctx: Context,
  ) {
    return this.tagService.delete(tagSlug, ctx.user!)
  }
}
