/*
 * translate-subfoods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {getModels as getOurModels} from '~/dao/models/foods/db.tables'
import {main as mainConnection} from '~/dao/connections/sequelize'
import {translationAttribute} from '~/dao/models/foods/db'
import {LANGUAGE_CODES} from '~/constants/enums'
import {Translation} from '~/dao/models'
import _ from 'lodash'

const ourModels = getOurModels(mainConnection)

const SUBFOODS = [
	['DUKE', 'duke'],
	['DTU', 'dtu'],
	['USDA', 'usda'],
	['PHENOL EXPLORER', 'phenol'],
	['KNAPSACK', 'knapsack'],
	['DFC CODES', 'dfc'],
	['MANUAL', 'manual'],
	['Wikipedia', 'wikipedia'],
	['SELFNutritionData', 'selfndata'],
	['Nutrition and You', 'n&u'],
	['Edible Medicinal And Non-Medicinal Plants: Volume 6, Fruits. By T. K. Lim', 'tklim'],
	['The World Healthiest Foods', 'twhf'],
	['DurableHealth', 'durablehealth'],
	['Richard G. St-Pierre. Quality & Nutritive Value of Saskatoon Fruit. January 2006', 'rgstpierre'],
	['All-Creatures', 'allcreatures'],
	['Tunde Jurikova  et al. Evaluation of Polyphenolic Profile and Nutritional Value of Non-Traditional Fruit Species in the Czech Republic — A Comparative Study. Molecules 2012, 17(8), 8968-8981; doi:10.3390/molecules17088968', 'tundej'],
	['The earth of India', 'teoindia'],
	['CalorieSlism', 'calorieslism'],
]

const totalTranslations: translationAttribute[] = []


async function main() {
	await Translation.destroy({
		where: {
			field: 'common_name'
		}
	})

	{
		console.log('Migrating Content...')
		let i = 0
		const count = 10000
		let cont = true
		while (cont) {
			console.log(`${i * count} created`)
			const all = await ourModels.Content.findAll({limit: count, offset: i * count})
			if (all.length === 0) {
				cont = false
			}
			i++

			const translations: translationAttribute[] = []

			// console.log('totalTranslations', totalTranslations.length)
			for (let i = 0; i < all.length; i++) {
				const content = all[i]

				// find abbr
				const found = SUBFOODS.find(p => p[0] === content.citation)
				if (!found) console.log(`NOT FOUND FOR ${content.citation}`)

				if (found && content.origFoodCommonName && content.origFoodId) {
					const sourceType = `food_${found[1]}`
					const hast = _.find(totalTranslations, p => ((p.sourceType === sourceType) && (String(p.sourceId) === String(content.origFoodId))))
					// process.stdout.write(hast ? '+' : '-')

					if (!hast) {
						translations.push({
							lang: LANGUAGE_CODES.en,
							text: content.origFoodCommonName,
							sourceId: content.origFoodId,
							sourceType: sourceType,
							field: 'common_name',
						})
						totalTranslations.push({
							lang: LANGUAGE_CODES.en,
							text: content.origFoodCommonName,
							sourceId: content.origFoodId,
							sourceType: sourceType,
							field: 'common_name',
						})
					}
				}
			}
			// console.log(translations.length)
			// {
			// 	translations.filter(tr => translations.find(p => (
			// 		(p.sourceType === tr.sourceType) &&
			// 		(p.sourceId === tr.sourceId)
			// 	)))
			// }
			// const trs = translations.filter(tr => !translations.find(p => (
			// 	(p.sourceType === tr.sourceType) &&
			// 	(p.sourceId === tr.sourceId)
			// )))
			await Translation.bulkCreate(translations)
			// totalTranslations.push(...translations)
		}
	}
}

main()
	.then(() => {
		console.log('Done')
		process.exit(0)
	})
	.catch(e => {
		console.error(e)
		process.exit(1)
	})