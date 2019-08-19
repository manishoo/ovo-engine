/*
 * tag.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { TagModel } from '@Models/tag.model'
import { LanguageCode } from '@Types/common'
import { Tag, TagInput } from '@Types/tag'
import Errors from '@Utils/errors'
import { Service } from 'typedi'


@Service()
export default class TagService {
  async list(): Promise<Tag[]> {
    return TagModel.find()
  }

  async validate(tag: string): Promise<Tag | null> {

    return TagModel.findById(tag)
  }

  async create(data: TagInput, lang: LanguageCode): Promise<Tag> {
    const tag = new TagModel({
      origInfo: data.info,
      origLang: lang,
      origTitle: data.title,
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
