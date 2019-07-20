/*
 * tag.model.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { LANGUAGE_CODES } from '@Types/common'
import { Tag, TAG_TYPE } from '@Types/tag'
import { prop, Typegoose } from 'typegoose'


export class TagSchema extends Typegoose implements Tag {
	@prop({ required: true })
	slug: string // only English: quick-bite
	@prop({ required: true })
	origTitle: string // translation: سریع‌الحلقوم | Quick bite
	@prop()
	origInfo?: string // info about the tag
	@prop({ required: true })
	origLang: LANGUAGE_CODES // translation: سریع‌الحلقوم | Quick bite
	@prop({ required: true })
	type: TAG_TYPE // recipe, cuisine, etc.

	createdAt?: Date
	updatedAt?: Date
}

export const TagModel = new TagSchema().getModelForClass(TagSchema, {
	schemaOptions: {
		timestamps: true,
	}
})
