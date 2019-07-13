/*
 * tag.service.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import TagRepository from '@dao/repositories/tag.repository'
import {TagInput} from '@dao/models/tag.model'
import {LANGUAGE_CODES} from '~/constants/enums'


class TagService {
	static async list() {
		return TagRepository.list()
	}

	static async create(data: TagInput, lang: LANGUAGE_CODES) {
		return TagRepository.create({
			origInfo: data.info,
			origLang: lang,
			origTitle: data.title,
			slug: data.slug,
			type: data.type,
		})
	}
}

export default TagService
