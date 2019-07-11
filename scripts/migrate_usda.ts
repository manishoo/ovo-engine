/*
 * migrate_usda.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {fndds} from '~/dao/connections/sequelize'
import Food, {FoodAttribute} from '~/dao/models/foods/food.model'
import {nutrientAttribute} from '~/dao/models/foods/nutrient.model'
import {nutrientDataAttribute} from '~/dao/models/foods/nutrient-data.model'
import FoodTr, {FoodTrAttribute} from '~/dao/models/foods/food-translation.model'
import FoodGroupTr from '~/dao/models/foods/food-group-translation.model'
import Nutrient from '~/dao/models/foods/nutrient.model'
import FoodGroup from '~/dao/models/foods/food-group.model'
import NutrientData from '~/dao/models/foods/nutrient-data.model'
import Weight from '~/dao/models/foods/weight.model'
import WeightTr from '~/dao/models/foods/weights-translation.model'
import {
	foodDesAttribute,
	nutrDefAttribute,
	nutDataAttribute,
	weightAttribute
} from '~/dao/models/_fndds-models/db'
import {weightAttribute as wAttr} from '~/dao/models/foods/weight.model'
import {weightTrAttribute} from '~/dao/models/foods/weights-translation.model'
import uuid from 'uuid/v1'

const FOOD_DES = fndds.import('../dao/models/fndds-models/FOOD_DES')
const WEIGHT = fndds.import('../dao/models/fndds-models/WEIGHT')

WEIGHT.removeAttribute('id')

const FOOD_GROUPS = [
	{fgid: '0100', en: 'Dairy and Egg Products', fa: 'لبنیات و تخم ها', image_url: ''},
	{fgid: '0200', en: 'Spices and Herbs', fa: 'ادویه‌جات', image_url: ''},
	{fgid: '0300', en: 'Baby Foods', fa: 'غذای کودک', image_url: ''},
	{fgid: '0400', en: 'Fats and Oils', fa: 'روغن‌ها و چربی‌ها', image_url: ''},
	{fgid: '0500', en: 'Poultry Products', fa: 'گوشت مرغ', image_url: ''},
	{fgid: '0600', en: 'Soups, Sauces, and Gravies', fa: 'سس ها', image_url: ''},
	{fgid: '0700', en: 'Sausages and Luncheon Meats', fa: 'فرآورده های گوشتی', image_url: ''},
	{fgid: '0800', en: 'Breakfast Cereals', fa: 'غلات صبحانه', image_url: ''},
	{fgid: '0900', en: 'Fruits and Fruit Juices', fa: 'میوه ها و آبمیوه ها', image_url: ''},
	{fgid: '1000', en: 'Pork Products', fa: 'گوشت خوک', image_url: ''},
	{fgid: '1100', en: 'Vegetables and Vegetable Products', fa: 'سبزیجات', image_url: ''},
	{fgid: '1200', en: 'Nut and Seed Products', fa: 'مغزیجات', image_url: ''},
	{fgid: '1300', en: 'Beef Products', fa: 'گوشت گاو', image_url: ''},
	{fgid: '1400', en: 'Beverages', fa: 'نوشیدنی ها', image_url: ''},
	{fgid: '1500', en: 'Finfish and Shellfish Products', fa: 'ماهی ها و آبزیان', image_url: ''},
	{fgid: '1600', en: 'Legumes and Legume Products', fa: 'حبوبات', image_url: ''},
	{fgid: '1700', en: 'Lamb, Veal, and Game Products', fa: 'گوشت گوسفند و گوساله', image_url: ''},
	{fgid: '1800', en: 'Baked Products', fa: 'محصولات پخته شده', image_url: ''},
	{fgid: '1900', en: 'Sweets', fa: 'شیرینیجات', image_url: ''},
	{fgid: '2000', en: 'Cereal Grains and Pasta', fa: 'غلات', image_url: ''},
	{fgid: '2100', en: 'Fast Foods', fa: 'فست‌فود', image_url: ''},
	{fgid: '2200', en: 'Meals, Entrees, and Side Dishes', fa: 'وعده های غذایی، نوشیدنی ها و غذاهای جانبی', image_url: ''},
	{fgid: '2500', en: 'Snacks', fa: 'تنقلات', image_url: ''},
	{fgid: '3500', en: 'American Indian/Alaska Native Foods', fa: 'مواد غذایی بومی آلاسکا و آمریکایی/هندی', image_url: ''},
	{fgid: '3600', en: 'Restaurant Foods', fa: 'غذا های رستورانی', image_url: ''},
]

const WEIGHT_UNITS = [
	{unit: 'fl oz', name: 'fl oz'},
	{unit: 'oz', name: 'oz'},
	{unit: 'lb', name: 'lb'},
	{unit: 'inch', name: 'inch'},
	{unit: '"', name: 'inch'},
	{unit: 'quart', name: 'quart'},
	{unit: 'pint', name: 'pint'},
]

enum LANGUAGES {
	en = 'en',
	fa = 'fa',
}

async function main() {
	/**
	 * Sync tables
	 * */
	const force = true
	await Weight.sync({force})
	await WeightTr.sync({force})
	await FoodTr.sync({force})
	await Food.sync({force})

	/**
	 * Migrate foods
	 * */
	console.log('Creating foods')
	const foods = await FOOD_DES.findAll()
	const finalFoods: FoodAttribute[] = []
	const foodTranslations: FoodTrAttribute[] = []
	const keptFoods: {
		fid?: string,
		ndbNo: string,
		manufacName?: string,
		comName?: string,
		refDesc?: string,
	}[] = []

	await Promise.all(foods.map(async value => {
		const {
			manufacName,
			comName,
			refDesc,
			fatFactor,
			choFactor,
			ndbNo,
			longDesc,
			fdGrpCd,
			nFActor,
			proFactor,
			refuse,
			sciName,
			shrtDesc,
			survey,
		} = <foodDesAttribute>value

		const fid = uuid()

		keptFoods.push({
			fid,
			ndbNo,
			manufacName,
			comName,
			refDesc,
		})

		finalFoods.push({
			fid,
			is_verified: false,
			fgid: fdGrpCd,
			// FIXME add food group image_url,
			manufac_name: manufacName,
			additional_data: {
				ndbNo,
				fatFactor,
				choFactor,
				longDesc,
				nFactor: nFActor,
				proFactor,
				refuse,
				sciName,
				shrtDesc,
				survey,
			},
		})
		// FIXME description and name
		const desc = longDesc.split(', ')
		desc.shift()
		foodTranslations.push({
			description: desc.join(', '),
			fid,
			lang: LANGUAGES.en,
			name: comName || longDesc.split(',')[0],
			refuse_desc: refDesc,
		})
	}))
	await Food.bulkCreate(finalFoods)
	await FoodTr.bulkCreate(foodTranslations)
	console.log('Creating foods OK')

	/**
	 * Migrate weights
	 * */
	console.log('Creating weights')
	const weightsToSave: wAttr[] = []
	const weightTrToSave: weightTrAttribute[] = []
	const ww = await WEIGHT.findAll()

	await Promise.all(ww.map(async value => {
		const {
			amount,
			gmWgt,
			msreDesc,
			ndbNo,
			numDataPts,
			seq,
			stdDev,
		} = <weightAttribute>value

		const fi = keptFoods.find(p => p.ndbNo == ndbNo)
		if (!fi) throw new Error('7')
		if (!fi.fid) throw new Error('8')


		const wid = uuid()
		let unit

		if (msreDesc.includes('cup (8 fl oz)')) {
			msreDesc.replace('cup (8 fl oz)', 'cup')
		}

		WEIGHT_UNITS.map(u => {
			const REGXP = `\\b${u.unit}\\b`
			if (msreDesc.match(new RegExp(REGXP))) {
				unit = u.name
			}
		})

		weightsToSave.push({
			wid,
			fid: fi.fid,
			amount,
			seq: Number(seq),
			gm_wgt: gmWgt,
			num_data_pts: numDataPts,
			std_dev: stdDev,
			unit,
		})
		weightTrToSave.push({
			lang: LANGUAGES.en,
			description: msreDesc || '',
			wid,
		})
	}))
	await Weight.bulkCreate(weightsToSave)
	await WeightTr.bulkCreate(weightTrToSave)
	console.log('Creating weights OK')

	const importTranslatedFoods = require('./import-translated-foods').default
	const importTranslatedWeights = require('./import-translated-weights').default

	console.log('Translating foods to farsi')
	await importTranslatedFoods()
	console.log('Translating weights to farsi')
	await importTranslatedWeights()
	console.log('Migration succeeded.')
	process.exit(0)
}

main()
	.catch(async e => {
		console.error(e)
		const force = true
		await FoodGroup.sync({force})
		await FoodGroupTr.sync({force})
		await Food.sync({force})
		await FoodTr.sync({force})
		await Nutrient.sync({force})
		await NutrientData.sync({force})
		await Weight.sync({force})
		await WeightTr.sync({force})
		console.error('failed, try again')
	})
