/*
 * tag.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Tag, TagModel} from '@dao/models/tag.model'

export default {
	async list(): Promise<Tag[]> {
		return TagModel.find()
	},
	async create(data: Tag): Promise<Tag> {
		const utensil = new TagModel(data)
		return utensil.save()
	},
	async findBySlug(slug: string): Promise<Tag> {
		const tag = await TagModel.findOne({slug})
		if (!tag) throw new Error('tag not found')

		return tag
	},
}
