/*
 * create-food-nutrition_.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { FoodModel } from '@Models/food.model'
import { FoodContent, Nutrition } from '@Types/food'


const argv = require('minimist')(process.argv.slice(2))

/**
 * Nutrition Fields
 *
 * NOTE: make sure this enum is the same fields in {Nutrition} type
 * */
enum N {
  saturatedFat = 'saturatedFat',
  alaFattyAcid_unused = 'alaFattyAcid',
  alanine = 'alanine',
  alcohol = 'alcohol',
  alphaCarotene = 'alphaCarotene',
  arginine = 'arginine',
  asparticAcid = 'asparticAcid',
  betaCarotene = 'betaCarotene',
  betaine = 'betaine',
  caffeine = 'caffeine',
  calcium = 'calcium',
  calories = 'calories',
  totalCarbs = 'totalCarbs',
  totalAvailableCarbs = 'totalAvailableCarbs',
  carbsByDifference = 'carbsByDifference',
  cholesterol = 'cholesterol',
  choline = 'choline',
  copper = 'copper',
  cystine = 'cystine',
  dhaFattyAcid_unused = 'dhaFattyAcid',
  dpaFattyAcid_unused = 'dpaFattyAcid',
  epaFattyAcid_unused = 'epaFattyAcid',
  fats = 'fats',
  fiber = 'fiber',
  fluoride_unused = 'fluoride',
  folate = 'folate',
  folateFood = 'folateFood',
  folateDFE = 'folateDFE',
  fructose = 'fructose',
  galactose = 'galactose',
  glucose = 'glucose',
  glutamicAcid = 'glutamicAcid',
  glycine = 'glycine',
  histidine = 'histidine',
  hydroxyproline_unused = 'hydroxyproline',
  iron = 'iron',
  isoleucine = 'isoleucine',
  lactose = 'lactose',
  leucine = 'leucine',
  lycopene = 'lycopene',
  lysine = 'lysine',
  magnesium = 'magnesium',
  maltose = 'maltose',
  manganese = 'manganese',
  methionine = 'methionine',
  monounsaturatedFats = 'monounsaturatedFats',
  niacin = 'niacin',
  niacinFromTryptophan = 'niacinFromTryptophan',
  totalNiacin = 'totalNiacin',
  pantothenicAcid = 'pantothenicAcid',
  phenylalanine = 'phenylalanine',
  phosphorus = 'phosphorus',
  polyunsaturatedFats = 'polyunsaturatedFats',
  potassium = 'potassium',
  proline = 'proline',
  proteins = 'proteins',
  proteinsTotalN = 'proteinsTotalN',
  retinol = 'retinol',
  riboflavin = 'riboflavin',
  saturatedFats = 'saturatedFats',
  selenium = 'selenium',
  serine = 'serine',
  sodium = 'sodium',
  starch = 'starch',
  sucrose = 'sucrose',
  sugar = 'sugar',
  theobromine = 'theobromine',
  thiamine = 'thiamine',
  threonine = 'threonine',
  totalOmega3_unused = 'totalOmega3',
  totalOmega6_unused = 'totalOmega6',
  transFats_unused = 'transFats',
  tryptophan = 'tryptophan',
  tyrosine = 'tyrosine',
  valine = 'valine',
  vitA = 'vitA',
  vitARAE = 'vitARAE',
  vitAIU_unused = 'vitAIU',
  vitB12 = 'vitB12',
  vitB6 = 'vitB6',
  vitC = 'vitC',
  vitCLAscorbic = 'vitCLAscorbic',
  vitCLDehydroascorbic = 'vitCLDehydroascorbic',
  vitD = 'vitD',
  vitD2andD3 = 'vitD2andD3',
  vitD2 = 'vitD2',
  vitD3 = 'vitD3',
  vitDUI_unused = 'vitDUI',
  vitE = 'vitE',
  vitK = 'vitK',
  water = 'water',
  zinc = 'zinc',
  null = 'null'
}

const NUTRITIONS: { [k: string]: string | null } = {
  'FAT': N.fats,
  'Protein, total': N.proteins,
  'Protein, total-N': N.proteinsTotalN,
  'Protein': N.proteins,
  'PROTEIN|PROTEINS': N.proteins,
  'Adjusted Protein': N.proteins,
  'Carbohydrates, total available': N.totalAvailableCarbs,
  'Carbohydrates, total': N.totalCarbs,
  'Carbohydrate, by difference': N.carbsByDifference,
  'CARBOHYDRATES': N.totalCarbs,
  'CARBOHYDRATE': N.totalCarbs,
  'CARBOHYDRATE|CARBOHYDRATES': N.totalCarbs,
  'Fat, total (Lipids)': N.fats,
  'Total lipid (fat)': N.fats,
  'FATTY-ACIDS': N.fats,
  'Fiber, dietary': N.fiber,
  'Fiber, total dietary (AOAC)': N.fiber,
  'Fiber, total dietary': N.fiber,
  'FIBER(DIETARY)': N.fiber,
  '13:0': null,
  '14:1': null,
  '15:1': null,
  '16:1 c': null,
  '16:1 t': null,
  '16:1 undifferentiated': null,
  '17:1': null,
  '18:1 c': null,
  '18:1 t': null,
  '18:1 undifferentiated': null,
  '18:2 CLAs': null,
  '18:2 i': null,
  '18:2 t not further defined': null,
  '18:2 t,t': null,
  '18:2 undifferentiated': null,
  '18:3 undifferentiated': null,
  '18:3i': null,
  '18:4': null,
  '20:1': null,
  '20:2 n-6 c,c': null,
  '20:3 n-3': null,
  '20:3 n-6': null,
  '20:3 undifferentiated': null,
  '20:4 undifferentiated': null,
  '21:5': null,
  'C22:0': null,
  '22:0': null,
  '22:1 c': null,
  '22:1 t': null,
  '22:1 undifferentiated': null,
  '22:4': null,
  'C22:5, n-3': null,
  '22:5 n-3 (DPA)': null,
  '24:1 c': null,
  'Energy': N.calories,
  'Fatty acids, total saturated': N.saturatedFats,
  'Fatty acids, total mono-unsaturated': N.monounsaturatedFats,
  'Fatty acids, total poly-unsaturated': N.polyunsaturatedFats,
  'Carbohydrates, added sugar (sucrose)': N.sucrose,
  'Alcohol (ethanol)': N.alcohol,
  'Ash': null,
  'Moisture': null,
  'Vitamin A, total': N.vitA,
  'Vitamin A (retinol)': N.retinol,
  'Carotene, beta': N.betaCarotene,
  'Vitamin D': N.vitD,
  'Vitamin D3 (cholecalciferol)': N.vitD3,
  'Vitamin D2 (ergocalciferol)': N.vitD2,
  'Vitamin E, total': N.vitE,
  'Vitamin E, alpha tocopherol': N.vitE,
  'Vitamin K, phylloquinone (K1)': N.vitK,
  'Vitamin B1 (as thiamin hydrochloride)': N.thiamine,
  'Vitamin B2 (riboflavin)': N.riboflavin,
  'Niacin, total': N.totalNiacin,
  'Niacin': N.niacin,
  'Niacin, from tryptophan': N.niacinFromTryptophan,
  'Vitamin B6 (as pyridoxinehydrochloride), total': N.vitB6,
  'Pantothenic acid': N.pantothenicAcid,
  'Biotin': null,
  'Folates': N.folate,
  'Vitamin B12 (as cyanocobalamin)': N.vitB12,
  'Vitamin C, total': N.vitC,
  'Vitamin C, total ascorbic acid': N.vitC,
  'Vitamin C, L-ascorbic acid': N.vitCLAscorbic,
  'Vitamin C, L-dehydroascorbic acid': N.vitCLDehydroascorbic,
  'Sodium (Na)': N.sodium,
  'Potassium (K)': N.potassium,
  'Calcium (Ca)': N.calcium,
  'Magnesium (Mg)': N.magnesium,
  'Phosphorus (P)': N.phosphorus,
  'Iron (Fe)': N.iron,
  'Copper (Cu)': N.copper,
  'Zinc (Zn)': N.zinc,
  'Iodine (I)': null,
  'Manganese (Mn)': N.manganese,
  'Chromium (Cr)': null,
  'Selenium (Se)': N.selenium,
  'Nickel (Ni)': null,
  'Fructose': N.fructose,
  'Glucose': N.glucose,
  'Lactose': N.lactose,
  'Maltose': N.maltose,
  'Sucrose': N.sucrose,
  'Sugars, total': N.sugar,
  'Starch (dextrins and glycogen)': N.starch,
  'Cholesterol': N.cholesterol,
  'Isoleucine': N.isoleucine,
  'Leucine': N.leucine,
  'Lysine': N.lysine,
  'Methionine': N.methionine,
  'Cystine': N.cystine,
  'Phenylalanine': N.phenylalanine,
  'Tyrosine': N.tyrosine,
  'Threonine': N.threonine,
  'Tryptophan': N.tryptophan,
  'Valine': N.valine,
  'Arginine': N.arginine,
  'Histidine': N.histidine,
  'Alanine': N.alanine,
  'Aspartic acid': N.asparticAcid,
  'Glutamic acid': N.glutamicAcid,
  'Glycine': N.glycine,
  'Proline': N.proline,
  'Serine': N.serine,
  'C4:0': null,
  'C6:0': null,
  'C8:0': null,
  'C10:0': null,
  'C12:0': null,
  'C14:0': null,
  'C15:0': null,
  'C16:0': null,
  'C17:0': null,
  'C18:0': null,
  'C20:0': null,
  'C24:0': null,
  'C14:1, n-5': null,
  'C16:1, n-7': null,
  'C18:1, n-9': null,
  'C18:1, n-7': null,
  'C20:1, n-11': null,
  'C22:1, n-9': null,
  'C22:1, n-11': null,
  'C18:2, n-6': null,
  'C18:3, n-3': null,
  'C18:4, n-3': null,
  'C20:4, n-6': null,
  'C20:5, n-3': null,
  'C22:6, n-3': null,

  'Starch': N.starch,
  'Glucose (dextrose)': N.glucose,
  'Alcohol, ethyl': N.alcohol,
  'Water': N.water,
  'Caffeine': N.caffeine,
  'Theobromine': N.theobromine,
  'Galactose': N.galactose,
  'Calcium, Ca': N.calcium,
  'Iron, Fe': N.iron,
  'Magnesium, Mg': N.magnesium,
  'Phosphorus, P': N.phosphorus,
  'Potassium, K': N.potassium,
  'Sodium, Na': N.sodium,
  'Zinc, Zn': N.zinc,
  'Copper, Cu': N.copper,
  'Manganese, Mn': N.magnesium,
  'Selenium, Se': N.selenium,
  'Vitamin A, IU': N.vitA,
  'Retinol': N.retinol,
  'Vitamin A, RAE': N.vitARAE,
  'Carotene, alpha': N.alphaCarotene,
  'Vitamin E (alpha-tocopherol)': N.vitE,
  'Vitamin D (D2 + D3)': N.vitD2andD3,
  'Cryptoxanthin, beta': null,
  'Lycopene': N.lycopene,
  'Tocopherol, beta': null,
  'Tocopherol, gamma': null,
  'Tocopherol, delta': null,
  'Thiamin': N.thiamine,
  'Riboflavin': N.riboflavin,
  'Vitamin B-6': N.vitB6,
  'Folate, total': N.folate,
  'Vitamin B-12': N.vitB12,
  'Choline, total': N.choline,
  'Dihydrophylloquinone': null,
  'Vitamin K (phylloquinone)': N.vitK,
  'Folic acid': null,
  'Folate, food': N.folateFood,
  'Folate, DFE': N.folateDFE,
  'Betaine': N.betaine,
  'Vitamin E, added': N.vitE,
  'Vitamin B-12, added': N.vitB12,
  '4:0': null,
  '6:0': null,
  '8:0': null,
  '10:0': null,
  '12:0': null,
  '14:0': null,
  '16:0': null,
  '18:0': null,
  '22:6 n-3 (DHA)': null,
  '20:5 n-3 (EPA)': null,
  'Fatty acids, total monounsaturated': N.monounsaturatedFats,
  'Fatty acids, total polyunsaturated': N.polyunsaturatedFats,

  '15:0': null,
  '17:0': null,
  '24:0': null,
  '18:2 n-6 c,c': null,
  '18:3 n-6 c,c,c': null,
  '18:3 n-3 c,c,c (ALA)': null,
  'Menaquinone-4': null,
}

function attachContentToNutrition(content: FoodContent, nutrition: Nutrition, contentOrigName: string, nutritionField: string) {
  if (content.origContentName && (content.origContentName.toString() === contentOrigName)) {
    if (nutrition[nutritionField]) {
      if ((content.unit !== nutrition[nutritionField]!.unit) && nutrition[nutritionField]!.amount && content.amount) {
        console.log('=====>>>>>>>')
        console.log('content: ', content.amount, content.unit, content.origContentName)
        console.log('food nutrition: ', nutrition[nutritionField]!.amount, nutrition[nutritionField]!.unit, contentOrigName)
        throw new Error('units not equal!')
      }
    }

    let totalAmount = content.amount
    if (nutrition[nutritionField]) {
      totalAmount += nutrition[nutritionField]!.amount + content.amount
    }

    nutrition[nutritionField] = {
      id: String(content.content),
      amount: totalAmount,
      unit: content.unit
    }
  }
}

function convertUnit(content: FoodContent): FoodContent {
  switch (content.unit) {
    case 'ppm':
      return {
        ...content,
        unit: 'ppm'
      }
    case 'g':
      return {
        ...content,
        unit: 'g'
      }
    case 'kJ':
      return {
        ...content,
        amount: Math.round(content.amount / 4.18),
        unit: 'kcal'
      }
    case 'kcal':
      return {
        ...content,
        unit: 'kcal'
      }
    case 'RE':
      return {
        ...content,
        unit: 'RE'
      }
    case 'ug':
      return {
        ...content,
        unit: 'µg'
      }
    case 'aTE':
      return {
        ...content,
        unit: 'mg' // DOUBT!
      }
    case 'mg':
      return {
        ...content,
        unit: 'mg'
      }
    case 'NE':
      return {
        ...content,
        unit: 'NE'
      }
    case 'IU':
      return {
        ...content,
        amount: Math.round(content.amount * 1.49),
        unit: 'α-TE'
      }
    case 'ug_RAE':
      return {
        ...content,
        unit: 'ug_RAE'
      }
    case 'ug_DFE':
      return {
        ...content,
        unit: 'ug_DFE'
      }
    case 'mg/100 g':
      return {
        ...content,
        unit: 'mg/100g'
      }
    case 'mg/100 ml':
      return {
        ...content,
        unit: 'mg/100ml'
      }
    case 'mg/100g':
      return {
        ...content,
        unit: 'mg/100g'
      }
    case 'α-TE':
      return {
        ...content,
        unit: 'mg' // DOUBT!
      }
    case 'µg':
      return {
        ...content,
        unit: 'µg'
      }
    case 'ug/g':
      return {
        ...content,
        unit: 'µg/g'
      }
    case 'uM':
      return {
        ...content,
        unit: 'µM'
      }
    case null:
    default:
      return content
  }
}

export function createFoodNutritionFromContents(contents: FoodContent[]): Nutrition {
  let nutrition: Partial<Nutrition> = {}

  contents.map(content => {
    /**
     * some foods have multiple {energy} content, one for kJ
     * and one for kcal. For them, we will ignore kJ calories.
     * */
    if (contents.filter(p => p.origContentName === 'Energy').length > 1) {
      if (content.origContentName === 'Energy' && content.unit === 'kJ') {
        return
      }
    }

    Object.keys(NUTRITIONS).map(name => {
      if (NUTRITIONS[name]) {
        attachContentToNutrition(convertUnit(content), nutrition, name, NUTRITIONS[name]!)
      }
    })
  })

  return nutrition
}

export default async function main() {
  console.log('Script started.')

  let foods = await FoodModel.find()
    .select('contents nutrition')
    .exec()

  await Promise.all(foods.map(async food => {
    food.nutrition = createFoodNutritionFromContents(food.contents)
    await food.save()
    process.stdout.write('.')
  }))

  console.log('Script finished.')
}

if (argv.run) {
  main()
    .then(() => {
      console.log('DONE')
    })
}
