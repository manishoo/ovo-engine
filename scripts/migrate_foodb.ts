// /*
//  * migrate_foodb.ts
//  * Copyright: Ouranos Studio 2019. All rights reserved.
//  */
//
// import {foodb, main as mainConnection, fndds as usdaConnection} from '../src/config/connections/sequelize'
// import {getModels as getFooDBModels} from '../src/models/_foodb-models/db.tables'
// import {getModels as getOurModels} from '../src/types/food-database-tables'
// import {LanguageCode} from '~/constants/enums'
// import uuid from 'uuid/v1'
// import {getModels as getUSDAModels} from '../src/models/_fndds-models/db.tables'
// import {foodVarietyAttribute, weightAttribute} from '../src/types/food-database'
// import {weightAttribute as USDAweightAttribute} from '../src/models/_fndds-models/db'
// import _ from 'lodash'
//
// const foodbModels = getFooDBModels(foodb)
// const ourModels = getOurModels(mainConnection)
// const usdaModels = getUSDAModels(usdaConnection)
//
// const SUBFOODS = [
// 	['DUKE', 'duke'],
// 	['DTU', 'dtu'],
// 	['USDA', 'usda'],
// 	['PHENOL EXPLORER', 'phenol'],
// 	['KNAPSACK', 'knapsack'],
// 	['DFC CODES', 'dfc'],
// 	['MANUAL', 'manual'],
// 	['Wikipedia', 'wikipedia'],
// 	['SELFNutritionData', 'selfndata'],
// 	['Nutrition and You', 'n&u'],
// 	['Edible Medicinal And Non-Medicinal Plants: Volume 6, Fruits. By T. K. Lim', 'tklim'],
// 	['The World Healthiest Foods', 'twhf'],
// 	['DurableHealth', 'durablehealth'],
// 	['Richard G. St-Pierre. Quality & Nutritive Value of Saskatoon Fruit. January 2006', 'rgstpierre'],
// 	['All-Creatures', 'allcreatures'],
// 	['Tunde Jurikova  et al. Evaluation of Polyphenolic Profile and Nutritional Value of Non-Traditional Fruit Species in the Czech Republic — A Comparative Study. Molecules 2012, 17(8), 8968-8981; doi:10.3390/molecules17088968', 'tundej'],
// 	['The earth of India', 'teoindia'],
// 	['CalorieSlism', 'calorieslism'],
// ]
//
// const WEIGHT_UNITS = [
// 	{unit: 'fl oz', name: 'fl oz'},
// 	{unit: 'oz', name: 'oz'},
// 	{unit: 'lb', name: 'lb'},
// 	{unit: 'inch', name: 'inch'},
// 	{unit: '"', name: 'inch'},
// 	{unit: 'quart', name: 'quart'},
// 	{unit: 'pint', name: 'pint'},
// ]
//
// async function migrateFoods() {
// 	console.log('Migrating Food...')
// 	await ourModels.Food.sync({force: true})
// 	await ourModels.FoodGroup.sync({force: true})
// 	await ourModels.Translation.destroy({
// 		where: {
// 			sourceType: 'food'
// 		}
// 	})
//
// 	async function createFoodGroup(foodGroup: string, foodSubGroup: string): Promise<number> {
// 		async function createFG(name: string, parentId?: number) {
// 			// @ts-ignore
// 			const fg = await ourModels.FoodGroup.create({
// 				origName: name,
// 				publicId: uuid(),
// 				parentId,
// 			})
// 			// // @ts-ignore
// 			// await ourModels.FoodGroupTr.create({
// 			// 	name,
// 			// 	lang: LanguageCode.en,
// 			// 	foodGroupId: fg.id,
// 			// })
//
// 			await ourModels.Translation.create({
// 				text: name,
// 				lang: LanguageCode.en,
// 				field: 'name',
// 				sourceType: 'food_group',
// 				sourceId: fg.id,
// 			})
//
// 			return fg
// 		}
//
// 		let id
//
// 		const fg = await ourModels.FoodGroup.findOne({where: {origName: foodGroup}})
// 		if (fg) {
// 			id = fg.id
// 			const fgg = await ourModels.FoodGroup.findOne({where: {origName: foodSubGroup}})
// 			if (!fgg && fg.id) {
// 				const f = await createFG(foodSubGroup, fg.id)
// 				id = f.id
// 			}
// 		} else {
// 			const fg = await createFG(foodGroup)
// 			id = fg.id
// 			const fgg = await ourModels.FoodGroup.findOne({where: {origName: foodSubGroup}})
// 			if (!fgg && fg.id) {
// 				const f = await createFG(foodSubGroup, fg.id)
// 				id = f.id
// 			}
// 		}
//
// 		if (!id) throw new Error()
// 		return id
// 	}
//
// 	async function createFoodTranslation(foodId: number, name: string, description?: string) {
// 		if (!foodId) throw new Error('no id')
//
// 		const translations = [
// 			{
// 				text: name,
// 				lang: LanguageCode.en,
// 				field: 'name',
// 				sourceType: 'food',
// 				sourceId: String(foodId),
// 			}
// 		]
//
// 		if (description) {
// 			translations.push({
// 				text: description,
// 				lang: LanguageCode.en,
// 				field: 'description',
// 				sourceType: 'food',
// 				sourceId: String(foodId),
// 			})
// 		}
//
// 		return ourModels.Translation.bulkCreate(translations)
// 	}
//
// 	const all = await foodbModels.foods.findAll()
// 	const foodsToCreate = []
// 	for (let i = 0; i < all.length; i++) {
// 		const {
// 			id,
// 			name,
// 			description,
// 			foodGroup,
// 			foodSubgroup,
// 			foodType,
// 			nameScientific,
// 			itisId,
// 			wikipediaId,
// 			pictureFileName,
// 			pictureContentType,
// 			pictureFileSize,
// 			pictureUpdatedAt,
// 			legacyId,
// 			createdAt,
// 			updatedAt,
// 			creatorId,
// 			updaterId,
// 			exportToAfcdb,
// 			category,
// 			ncbiTaxonomyId,
// 			exportToFoodb,
// 		} = all[i]
// 		const foodGroupId = await createFoodGroup(foodGroup, foodSubgroup)
// 		await createFoodTranslation(id, name, description)
//
// 		const uui = uuid()
//
// 		foodsToCreate.push({
// 			id,
// 			publicId: uui,
// 			origName: name,
// 			slug: uui,
// 			foodGroupId,
// 			foodType,
// 			nameScientific,
// 			itisId,
// 			wikipediaId,
// 			pictureFileName,
// 			pictureContentType,
// 			pictureFileSize,
// 			pictureUpdatedAt,
// 			legacyId,
// 			createdAt,
// 			updatedAt,
// 			creatorId,
// 			updaterId,
// 			exportToAfcdb,
// 			category,
// 			ncbiTaxonomyId,
// 			exportToFoodb,
// 			isVerified: false,
// 		})
// 	}
// 	await ourModels.Food.bulkCreate(foodsToCreate)
// 	console.log('Migrating Food OK')
// }
//
// async function createFoodVarieties() {
// 	console.log('Migrating food varieties...')
// 	await ourModels.Translation.destroy({
// 		where: {
// 			sourceType: 'food_variety'
// 		}
// 	})
// 	await ourModels.FoodVariety.sync({force: true})
// 	const allFoodVarieties: foodVarietyAttribute[] = []
// 	/**
// 	 * Get contents 10000 at a time and if we haven't already added it's food variety, add it.
// 	 * */
// 	let i = 0
// 	const count = 10000
// 	let cont = true
// 	while (cont) {
// 		console.log(`${i * count} round`)
// 		const all = await ourModels.Content.findAll({limit: count, offset: i * count})
// 		if (all.length === 0) {
// 			cont = false
// 		}
// 		i++
//
// 		const foodVarieties: foodVarietyAttribute[] = []
//
// 		for (let i = 0; i < all.length; i++) {
// 			const content = all[i]
//
// 			// find abbr
// 			const found = SUBFOODS.find(p => p[0] === content.citation)
// 			if (!found) console.log(`NOT FOUND FOR ${content.citation}`)
//
// 			if (found && content.origFoodCommonName && content.origFoodId) {
// 				const origCitationAbbr = found[1]
//
// 				const hast = _.find(allFoodVarieties, p => ((p.origFoodId === content.origFoodId) && (String(p.origDb) === origCitationAbbr)))
//
// 				if (!hast) {
// 					const fv = {
// 						foodId: content.foodId,
// 						origDb: origCitationAbbr,
// 						origFoodId: content.origFoodId,
// 						origFoodName: content.origFoodCommonName,
// 						publicId: uuid(),
// 						nutritionalData: {},
// 					}
// 					foodVarieties.push(fv)
// 					allFoodVarieties.push(fv)
// 				}
// 			}
// 		}
//
// 		const savedFoodVarieties = await ourModels.FoodVariety.bulkCreate(foodVarieties)
// 		await ourModels.Translation.bulkCreate(savedFoodVarieties.map(fv => ({
// 			text: fv.origFoodName,
// 			lang: LanguageCode.en,
// 			sourceId: String(fv.id!),
// 			sourceType: 'food_variety',
// 			field: 'name',
// 		})))
// 	}
// 	console.log('Migrating food varieties Ok!')
// }
//
// async function migrateWeights() {
// 	await usdaModels.weight.removeAttribute('id')
// 	await ourModels.Weight.sync({force: true})
// 	await ourModels.Translation.destroy({
// 		where: {
// 			sourceType: 'weight',
// 		}
// 	})
//
// 	console.log('Creating weights')
// 	const weightsToSave: weightAttribute[] = []
// 	const weightTrs: any[] = []
// 	const ww = await usdaModels.weight.findAll()
//
// 	const fvs = await ourModels.FoodVariety.findAll({where: {origDb: 'usda', origFoodId: {[foodb.Sequelize.Op.in]: ww.map(i => i.ndbNo)}}})
//
// 	await Promise.all(ww.map(async value => {
// 		const {
// 			amount,
// 			gmWgt,
// 			msreDesc,
// 			ndbNo,
// 			numDataPts,
// 			seq,
// 			stdDev,
// 		} = <USDAweightAttribute>value
//
// 		const publicId = uuid()
// 		let unit
//
// 		// // FIXME you can do better
// 		// if (msreDesc.includes(' (8 fl oz)')) {
// 		// 	msreDesc.replace(' (8 fl oz)', '')
// 		// }
//
// 		/**
// 		 * Find the unit
// 		 * */
// 		WEIGHT_UNITS.map(u => {
// 			const REGXP = `\\b${u.unit}\\b`
// 			if (msreDesc.match(new RegExp(REGXP))) {
// 				unit = u.name
// 			}
// 		})
//
// 		// TODO change origDb to sourceDb
// 		// const fv = await ourModels.FoodVariety.findOne({where: {origDb: 'usda', origFoodId: ndbNo}})
// 		const fv = fvs.find(p => p.origFoodId === ndbNo)
//
// 		if (fv) {
// 			weightsToSave.push({
// 				amount,
// 				foodVarietyId: fv.id!,
// 				origDescription: msreDesc,
// 				publicId,
// 				seq: Number(seq),
// 				gmWgt,
// 				numDataPts,
// 				stdDev,
// 				unit,
// 			})
// 			weightTrs.push({
// 				msreDesc,
// 				publicId,
// 			})
// 		}
// 	}))
// 	const weights = await ourModels.Weight.bulkCreate(weightsToSave)
// 	await ourModels.Translation.bulkCreate(weights.map(t => ({
// 		lang: LanguageCode.en,
// 		text: weightTrs.find(p => p.publicId === t.publicId).msreDesc,
// 		field: 'description',
// 		sourceId: String(t.id!),
// 		sourceType: 'weight',
// 	})))
// 	console.log('Creating weights OK')
// }
//
// async function main() {
// 	/**
// 	 * Sync DB
// 	 * */
// 	const force = true
// 	// await ourModels.CompoundSubstituent.sync({force})
// 	// await ourModels.CompoundExternalDescriptor.sync({force})
// 	// await ourModels.CompoundAlternateParent.sync({force})
// 	// await ourModels.CompoundSynonym.sync({force})
// 	// await ourModels.CompoundsEnzyme.sync({force})
// 	// await ourModels.CompoundsFlavor.sync({force})
// 	// await ourModels.Compound.sync({force})
// 	// await ourModels.HealthEffect.sync({force})
// 	// await ourModels.CompoundsHealthEffect.sync({force})
// 	// await ourModels.Pathway.sync({force})
// 	// await ourModels.CompoundsPathway.sync({force})
// 	// await ourModels.Content.sync({force})
// 	// await ourModels.Flavor.sync({force})
// 	// await ourModels.FoodTaxonomy.sync({force})
// 	// await ourModels.FoodcomexCompoundProvider.sync({force})
// 	// await ourModels.Enzyme.sync({force})
// 	// await ourModels.FoodcomexCompound.sync({force})
// 	// await ourModels.Nutrient.sync({force})
// 	// await ourModels.Reference.sync({force})
// 	// await ourModels.FoodTr.sync({force})
// 	// await ourModels.FoodGroupTr.sync({force})
// 	// await ourModels.WeightTr.sync({force})
// 	// /**
// 	//  * Content Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Content...')
// 	// 	let i = 0
// 	// 	const count = 100000
// 	// 	let cont = true
// 	// 	while (cont) {
// 	// 		console.log(`${i * count} creted`)
// 	// 		const all = await foodbModels.contents.findAll({limit: count, offset: i * count})
// 	// 		if (all.length === 0) {
// 	// 			cont = false
// 	// 		}
// 	// 		i++
// 	// 		await ourModels.Content.bulkCreate(all.map(i => i.toJSON()))
// 	// 	}
// 	// }
// 	//
// 	// /**
// 	//  * CompoundSubstituent Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundSubstituent...')
// 	// 	const all = await foodbModels.compoundSubstituents.findAll()
// 	// 	await ourModels.CompoundSubstituent.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundExternalDescriptor Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundExternalDescriptor...')
// 	// 	const all = await foodbModels.compoundExternalDescriptors.findAll()
// 	// 	await ourModels.CompoundExternalDescriptor.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundAlternateParent Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundAlternateParent...')
// 	// 	const all = await foodbModels.compoundAlternateParents.findAll()
// 	// 	await ourModels.CompoundAlternateParent.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundSynonym Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundSynonym...')
// 	// 	const all = await foodbModels.compoundSynonyms.findAll()
// 	// 	await ourModels.CompoundSynonym.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Compound Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Compound...')
// 	// 	const all = await foodbModels.compounds.findAll()
// 	// 	const arrays = []
// 	// 	const size = 1000
// 	//
// 	// 	while (all.length > 0) {
// 	// 		arrays.push(all.splice(0, size))
// 	// 	}
// 	//
// 	// 	for (let i = 0; i < arrays.length; i++) {
// 	// 		await ourModels.Compound.bulkCreate(arrays[i].map(i => i.toJSON()))
// 	// 	}
// 	// }
// 	//
// 	// /**
// 	//  * CompoundsEnzyme Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundsEnzyme...')
// 	// 	const all = await foodbModels.compoundsEnzymes.findAll()
// 	// 	await ourModels.CompoundsEnzyme.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundsFlavor Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundsFlavor...')
// 	// 	const all = await foodbModels.compoundsFlavors.findAll()
// 	// 	await ourModels.CompoundsFlavor.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundsHealthEffect Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundsHealthEffect...')
// 	// 	const all = await foodbModels.compoundsHealthEffects.findAll()
// 	// 	await ourModels.CompoundsHealthEffect.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * CompoundsPathway Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating CompoundsPathway...')
// 	// 	const all = await foodbModels.compoundsPathways.findAll()
// 	// 	await ourModels.CompoundsPathway.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Flavor Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Flavor...')
// 	// 	const all = await foodbModels.flavors.findAll()
// 	// 	await ourModels.Flavor.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * FoodTaxonomy Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating FoodTaxonomy...')
// 	// 	const all = await foodbModels.foodTaxonomies.findAll()
// 	// 	await ourModels.FoodTaxonomy.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * FoodcomexCompoundProvider Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating FoodcomexCompoundProvider...')
// 	// 	const all = await foodbModels.foodcomexCompoundProviders.findAll()
// 	// 	await ourModels.FoodcomexCompoundProvider.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Enzyme Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Enzyme...')
// 	// 	const all = await foodbModels.enzymes.findAll()
// 	// 	await ourModels.Enzyme.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * HealthEffect Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating HealthEffect...')
// 	// 	const all = await foodbModels.healthEffects.findAll()
// 	// 	await ourModels.HealthEffect.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * FoodcomexCompound Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating FoodcomexCompound...')
// 	// 	const all = await foodbModels.foodcomexCompounds.findAll()
// 	// 	await ourModels.FoodcomexCompound.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Nutrient Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Nutrient...')
// 	// 	const all = await foodbModels.nutrients.findAll()
// 	// 	await ourModels.Nutrient.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Pathway Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Pathway...')
// 	// 	const all = await foodbModels.pathways.findAll()
// 	// 	await ourModels.Pathway.bulkCreate(all.map(i => i.toJSON()))
// 	// }
// 	//
// 	// /**
// 	//  * Reference Migration
// 	//  * */
// 	// {
// 	// 	console.log('Migrating Reference...')
// 	// 	const all = await foodbModels.references.findAll()
// 	// 	await ourModels.Reference.bulkCreate(all.map(i => i.toJSON()))
// 	// }
//
// 	/**
// 	 * Food Migration
// 	 * */
// 	await migrateFoods()
//
// 	/**
// 	 * Food Variety Migration
// 	 * */
// 	// await createFoodVarieties()
//
// 	/**
// 	 * Weight Migration
// 	 * */
// 	// await migrateWeights()
//
// 	/**
// 	 * Translate food varieties
// 	 * */
// }
//
//
// main()
// 	.then(() => {
// 		console.log('Done')
// 		process.exit(0)
// 	})
// 	.catch(e => {
// 		console.error(e)
// 		console.error('Error')
// 	})
