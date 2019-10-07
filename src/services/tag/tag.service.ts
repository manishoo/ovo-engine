/*
 * tag.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { TagModel } from '@Models/tag.model'
import { ObjectId, Role } from '@Types/common'
import { Tag, TagInput, TagType } from '@Types/tag'
import { ContextUser } from '@Utils/context'
import { DeleteBy } from '@Utils/delete-by'
import Errors from '@Utils/errors'
import shortid from 'shortid'
import slug from 'slug'
import { Service } from 'typedi'


@Service()
export default class TagService {
  async list(): Promise<Tag[]> {
    return TagModel.find({
      type: { $ne: TagType.imported }
    })
  }

  async create(data: TagInput, user?: ContextUser): Promise<Tag> {
    let q: any = {}
    q['slug'] = data.slug
    const validateTag = await TagModel.findOne(q)
    if (validateTag) throw new Errors.UserInput('This tag already exists', { 'title text': 'This title already exists' })

    if (!data.slug) {
      data.slug = `${slug(data.title[0].text)}-${shortid.generate()}`
    }
    const tag = new TagModel({
      info: data.info,
      title: data.title,
      slug: data.slug,
      type: data.type,
      user: user ? user.id : undefined,
    })
    return tag.save()
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await TagModel.findOne({ slug })
    if (!tag) throw new Errors.NotFound('tag not found')

    return tag
  }

  async delete(tagSlug: string, user: ContextUser) {
    const q: any = {
      slug: tagSlug,
    }

    if (user.role === Role.user) {
      q['user'] = ObjectId(user.id)
    }

    await TagModel.delete(q, DeleteBy.user(user))

    return tagSlug
  }
}
