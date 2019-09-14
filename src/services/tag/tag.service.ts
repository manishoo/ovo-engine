/*
 * tag.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { TagModel } from '@Models/tag.model'
import { Tag, TagInput } from '@Types/tag'
import Errors from '@Utils/errors'
import { Service } from 'typedi'
import shortid = require('shortid')
import slug = require('slug')


@Service()
export default class TagService {
  async list(): Promise<Tag[]> {
    return TagModel.find()
  }

  async create(data: TagInput): Promise<Tag> {
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
    })
    return tag.save()
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await TagModel.findOne({ slug })
    if (!tag) throw new Errors.NotFound('tag not found')

    return tag
  }
}
