/*
 * import-translated-weights.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import uniqueTokens from './weight-uniqueTokens-1.json'
import {WeightTr} from '~/dao/models'
import {LANGUAGE_CODES} from '~/constants/enums'
import {weightTrAttribute} from '~/dao/models/foods/db.js'

export default async function main() {
	await WeightTr.destroy({where: {lang: LANGUAGE_CODES.fa}})
	const weightTrs = await WeightTr.findAll()

	const arrays = []
	const size = 1000

	while (weightTrs.length > 0)
		arrays.push(weightTrs.splice(0, size))

	for (let i = 0; i < arrays.length; i++) {
		const weightTrsToSave: weightTrAttribute[] = []
		const wtrs = arrays[i]

		await Promise.all(wtrs.map(async wtr => {
			let description
			const found = uniqueTokens.find(p => p.token === wtr.description)
			if (found && found.tr) {
				description = found.tr
			}

			if (description) {
				// @ts-ignore
				weightTrsToSave.push({
					weightId: wtr.weightId,
					lang: LANGUAGE_CODES.fa,
					description,
				})
			}
		}))
		console.log('weightTrsToSave', weightTrsToSave)
		await WeightTr.bulkCreate(weightTrsToSave)
	}
}

// main()
// 	.then(() => process.exit(0))
// 	.catch((e) => console.error(e))
