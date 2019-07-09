/*
 * weight.repository.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {WeightInput, Weight as WeightType, WeightTranslationO} from '~/dao/types'
import uuid from 'uuid/v1'
import {LANGUAGE_CODES} from '~/constants/enums'
import {Translation, Weight} from '~/dao/models'

export default {
	async findByPublicId(publicId: string, lang: LANGUAGE_CODES): Promise<WeightType> {
		const w = await Weight.findOne({
			where: {publicId},
			include: [
				{
					model: Translation,
					as: 'translations',
					required: true,
					where: {sourceType: 'weight', lang},
				}
			],
		})

		if (!w) throw new Error('no w 1')

		if (w.translations.length === 0) throw new Error('translation not founnd')

		let translations: WeightTranslationO[] = []
		let description = w.translations[0].text
		if (w.translations) {
			translations = w.translations.map(tr => ({
				description: tr.text,
				lang: <LANGUAGE_CODES>tr.lang,
			}))
		}

		return {
			translations,
			description,
			unit: w.unit,
			seq: w.seq,
			amount: w.amount,
			id: w.publicId,
			gramWeight: w.gmWgt,
		}
	},
	async findOne(wid: string, lang?: LANGUAGE_CODES): Promise<WeightType> {
		const w = await Weight.findByPk(wid, {
			include: [
				{
					model: Translation,
					as: 'translations',
					required: true,
					where: {sourceType: 'weight'},
				}
			]
		})

		if (!w) throw new Error('no w 2')

		let translations: WeightTranslationO[] = []
		if (w.translations) {
			translations = w.translations.map(tr => ({
				description: tr.text,
				lang: <LANGUAGE_CODES>tr.lang,
			}))
		}

		let description
		if (lang) {
			const found = translations.find(p => p.lang === lang)
			if (found) {
				description = found.description
			}
		}

		return {
			translations,
			description,
			unit: w.unit,
			seq: w.seq,
			amount: w.amount,
			id: w.publicId,
			gramWeight: w.gmWgt,
		}
	},
	async create(fid: number, data: WeightInput | WeightType): Promise<WeightType> {
		// @ts-ignore
		const createdWeight = await Weight.create({
			publicId: uuid(),
			foodVarietyId: fid,
			amount: data.amount,
			gmWgt: data.gramWeight,
			seq: data.seq,
			unit: data.unit,
		})
		// @ts-ignore
		await WeightTr.bulkCreate((data.translations || []).map(tr => ({
			lang: tr.lang,
			description: tr.description,
			weightId: createdWeight.id,
		})))

		return this.findOne(createdWeight.id)
	},
	async update(wid: number, data: WeightType): Promise<WeightType> {
		const weight = await Weight.findByPk(wid)
		if (!weight) throw new Error('not found')

		weight.amount = data.amount
		weight.unit = data.unit
		weight.seq = data.seq
		weight.gmWgt = data.gramWeight

		if (weight.getTranslations) {
			const translations = await weight.getTranslations()
			// check for deletion or update
			await Promise.all(translations.map(async tr => {
				const sameLang = (data.translations || []).find(p => p.lang === tr.lang)
				if (sameLang) {
					tr.text = sameLang.description
					await tr.save()
				} else {
					await Translation.destroy({where: {lang: tr.lang, sourceId: wid, sourceType: 'weight'}})
				}
			}))

			await Promise.all((data.translations || []).map(async tr => {
				const newLang = translations.find(p => p.lang === tr.lang)

				if (!newLang) {
					// @ts-ignore
					await WeightTr.create({
						weightId: weight.id,
						lang: tr.lang,
						description: tr.description,
					})
				}
			}))
		}

		await weight.save()
		return this.findOne(weight.id)
	},
	async delete(wid: number) {
		const n = await Weight.destroy({where: {wid}})

		return n === 1
	},
}