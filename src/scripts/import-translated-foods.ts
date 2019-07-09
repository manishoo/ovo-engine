/*
 * import-translated-foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {Food, FoodTr} from '~/dao/models'
import FoodRepo from '~/dao/repositories/food.repository'
import {LANGUAGE_CODES} from '~/constants/enums'
import uniqueTokens from './uniqueTokens-2.json'
// import {ABBRS} from '~/scripts/auto-translate-foods'

export default async function main() {
	/**
	 * Gather foods
	 * */
	await FoodTr.destroy({where: {lang: LANGUAGE_CODES.fa}})

	const foods = await Food.findAll({
		where: {
			manufac_name: null,
		}
	})

	const arrays = []
	const size = 1000

	while (foods.length > 0)
		arrays.push(foods.splice(0, size))

	console.log('arrays', arrays.length)

	for (let i = 0; i < arrays.length; i++) {
		const foods = arrays[i]

		await Promise.all(foods.map(async food => {
			if (!food) return null
			if (!food.additional_data.longDesc) return null
			const inUniq = uniqueTokens.find(p => p.token === food.additional_data.longDesc)
			let name = ''
			if (inUniq) {
				name = inUniq.tr || ''
			}
			await FoodRepo.submitTranslation(food.fid, LANGUAGE_CODES.fa, name)
			process.stdout.write('.')
		}))
	}

	// for (let i = 0; i < foods.length; i++) {
	// }

	/*
		for (let i = 0; i < foods.length; i++) {
			const food = foods[i]

			if (!food) return null
			if (!food.additional_data.shrtDesc) return null
			let name
			let description = ''
			const arr = food.additional_data.shrtDesc.split(',').reverse()
			arr.forEach((token: string, index) => {
				const inUniq = uniqueTokens.find(p => p.token === token)
				const inAbbr = ABBRS.find(p => p.abbr === token)
				if (index === (arr.length - 1)) {
					if (inUniq) {
						name = inUniq.tr
					}
					if (inAbbr) {
						name = inAbbr.tr
					}
				} else {
					if (inUniq) {
						if (description === '') {
							description = inUniq.tr || ''
						}
						description = `${inUniq.tr}, ${description}`
					}
					if (inAbbr) {
						if (description === '') {
							description = inAbbr.tr
						}
						description = `${inAbbr.tr}, ${description}`
					}
				}
			})
			await FoodRepo.submitTranslation(food.fid, LANGUAGE_CODES.fa, name || '', description)
			process.stdout.write('.')
		}
	*/
}

//
// main()
// 	.then(() => process.exit(0))
// 	.catch(e => console.error(e))
