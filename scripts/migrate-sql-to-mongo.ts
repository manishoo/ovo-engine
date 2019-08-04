/*
 * migrate-sql-to-mongo.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Sequelize } from 'sequelize'
import shortid from 'shortid'
import slug from 'slug'
import mongoose from '~/config/connections/mongoose'
import config from '../src/config'
import { compoundsAttribute, nutrientsAttribute } from '../src/models/_foodb-models/db'
import { getModels as getFooDBModels } from '../src/models/_foodb-models/db.tables'
import { getModels as getOurModels } from '../src/models/_foods/food-database-tables'
import { ContentModel as mongoContentModel } from '../src/models/content.model'
import { FoodClassModel as mongoFoodClassModel } from '../src/models/food-class.model'
import { FoodGroupModel as mongoFoodGroupModel } from '../src/models/food-group.model'
import { FoodModel as mongoFoodModel } from '../src/models/food.model'
import { LANGUAGE_CODES, Translation } from '../src/types/common'
import { Content, CONTENT_TYPE } from '../src/types/content'
import { FoodContent } from '../src/types/food'
import { FoodClass, FoodClassTaxonomy } from '../src/types/food-class'
import { FoodGroup } from '../src/types/food-group'

const mainConnection = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})
const foodb = new Sequelize('foodb', config.mysql.user, config.mysql.pass, {
	host: config.mysql.host,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
})

const CITATIONS = [
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

function createTranslations(name: string): Translation[] {
	return [
		{ locale: LANGUAGE_CODES.en, text: name }
	]
}

const foodbModels = getFooDBModels(foodb)
const newCaloModels = getOurModels(mainConnection)

async function migrateFoodClassesAndFoodGroups() {
	console.log('Migrating food classes...')

	await mongoFoodGroupModel.deleteMany({})
	await mongoFoodClassModel.deleteMany({})

	async function createFoodGroup(foodGroup: string, foodSubGroup: string): Promise<number> {
		async function _createFG(name: string, parentId?: mongoose.Schema.Types.ObjectId) {
			return mongoFoodGroupModel.create(<Partial<FoodGroup>>{
				name: createTranslations(name),
				parentFoodGroup: parentId,
			})
		}

		async function _findFG(name: string) {
			return mongoFoodGroupModel.findOne({ 'name.text': name })
		}

		let id

		const fg = await _findFG(foodGroup)
		if (fg) {
			id = fg.id
			const fgg = await _findFG(foodSubGroup)
			if (!fgg && fg.id) {
				const f = await _createFG(foodSubGroup, fg.id)
				id = f._id
			}
		} else {
			const fg = await _createFG(foodGroup)
			id = fg._id
			const fgg = await _findFG(foodSubGroup)
			if (!fgg && fg.id) {
				const f = await _createFG(foodSubGroup, fg.id)
				id = f._id
			}
		}

		if (!id) throw new Error()
		return id
	}

	const all = await foodbModels.foods.findAll()
	const foodsToCreate = []
	for (let i = 0; i < all.length; i++) {
		const {
			id,
			name,
			description,
			foodGroup,
			foodSubgroup,
			foodType,
			nameScientific,
			itisId,
			wikipediaId,
			pictureFileName,
			pictureContentType,
			pictureFileSize,
			pictureUpdatedAt,
			legacyId,
			createdAt,
			updatedAt,
			creatorId,
			updaterId,
			exportToAfcdb,
			category,
			ncbiTaxonomyId,
			exportToFoodb,
		} = all[i]
		const foodGroupId = await createFoodGroup(foodGroup, foodSubgroup)
		const taxonomies = await foodbModels.foodTaxonomies.findAll()

		foodsToCreate.push(<Partial<FoodClass>>{
			category,
			foodType,
			itisId,
			nameScientific,
			ncbiTaxonomyId,
			wikipediaId,
			origId: id,
			slug: slug(`${name}-${shortid()}`),
			name: createTranslations(name),
			description: description && createTranslations(description),
			foodGroup: await mongoFoodGroupModel.findById(foodGroupId),
			taxonomies: taxonomies.map(taxonomy => ({
				ncbiTaxonomyId: taxonomy.ncbiTaxonomyId,
				classificationName: taxonomy.classificationName,
				classificationOrder: taxonomy.classificationOrder,
			})) as FoodClassTaxonomy[],
		})
	}
	await mongoFoodClassModel.create(foodsToCreate)
	console.log('Migrating food classes OK')
}

async function migrateContents() {
	/**
	 * Nutrient Migration
	 * */
	{
		console.log('Migrating Nutrient...')
		const all = await foodbModels.nutrients.findAll()

		await mongoContentModel.create(all.map(({ id, name }: nutrientsAttribute) => (<Partial<Content>>{
			name: createTranslations(name),
			type: CONTENT_TYPE.Nutrient,
			origId: id,
		})))
	}

	/**
	 * Compound Migration
	 * */
	{
		console.log('Migrating Compound...')
		await mongoContentModel.remove({})
		const all = await foodbModels.compounds.findAll()
		const arrays = []
		const size = 1000

		while (all.length > 0) {
			arrays.push(all.splice(0, size))
		}

		for (let i = 0; i < arrays.length; i++) {
			await mongoContentModel.create(arrays[i].map(({ id, name, ...compound }: compoundsAttribute) => (<Partial<Content>>{
				name: createTranslations(name),
				type: CONTENT_TYPE.Compound,
				origId: id,

				...compound,
			})))
		}
	}
}

async function migrateFoods() {
	console.log('Migrating foods...')
	await mongoFoodModel.deleteMany({})
	const caloNewfoodVarieties = await newCaloModels.FoodVariety.findAll()
	const caloNewWeights = await newCaloModels.Weight.findAll()
	const contents = await mongoContentModel.find()
	const foodClasses = await mongoFoodClassModel.find()

	let totalCount = caloNewfoodVarieties.length

	const arrays = []
	const size = 500

	while (caloNewfoodVarieties.length > 0) {
		arrays.push(caloNewfoodVarieties.splice(0, size))
	}

	for (let i = 0; i < arrays.length; i++) {
		const foodVarieties = arrays[i]

		const foodbContents = await foodbModels.contents.findAll({
			where: {
				// origFoodId: {
				// 	[Sequelize.Op.in]: foodVarieties.map(fv => fv.origFoodId)
				// },
				[Sequelize.Op.or]: foodVarieties.map(fv => {
					let citation
					const found = CITATIONS.find(i => i[1] === fv.origDb)
					if (found) {
						citation = found[0]
					}

					return {
						origFoodId: fv.origFoodId,
						citation,
					}
				})
			}
		})

		await mongoFoodModel.create(foodVarieties.map(caloNewfoodVariety => {
			const fooooooo = foodbContents.filter(i => {
				let citation
				const found = CITATIONS.find(i => i[1] === caloNewfoodVariety.origDb)
				if (found) {
					citation = found[0]
				}

				return ((i.origFoodId === caloNewfoodVariety.origFoodId) && (i.citation === citation))
			})

			return {
				name: createTranslations(caloNewfoodVariety.origFoodName),
				foodClass: foodClasses.find(i => i.origId === caloNewfoodVariety.foodId)!._id,
				origDb: caloNewfoodVariety.origDb,
				origFoodId: caloNewfoodVariety.origFoodId,
				weights: caloNewWeights.filter(i => i.foodVarietyId === caloNewfoodVariety.id).map(w => ({
					id: new mongoose.Types.ObjectId(),
					seq: w.seq,
					gramWeight: w.gmWgt,
					amount: w.amount,
					name: createTranslations(w.origDescription),
				})),
				contents: fooooooo.map(foodbContent => {
					const content = contents.find(c => (c.origId === foodbContent.sourceId) && (foodbContent.sourceType === c.type))
					if (!content) throw new Error('content not found')

					return {
						amount: Number(foodbContent.origContent),
						citation: foodbContent.citation,
						citationType: foodbContent.citationType,
						origContentName: content.getName(LANGUAGE_CODES.en),
						origContentType: content.type,
						standardContent: Number(foodbContent.standardContent),
						unit: foodbContent.origUnit,
						content: content._id,
					} as FoodContent
				}),
			}
		}))
		console.log(`${totalCount - size} left`)
		totalCount = totalCount - size
	}

	console.log('Migrating foods Ok')
}

async function main() {
	await migrateFoodClassesAndFoodGroups()
	await migrateContents()
	await migrateFoods()
}

main()
	.then(() => process.exit(0))