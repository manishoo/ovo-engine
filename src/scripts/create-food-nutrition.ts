import { FoodModel, FoodSchema } from '@Models/food.model'
import { FoodContent, Nutrition } from '@Types/food'
import { InstanceType } from 'typegoose'


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
  alphaCarotene_unused = 'alphaCarotene',
  arginine = 'arginine',
  asparticAcid = 'asparticAcid',
  betaCarotene = 'betaCarotene',
  betaine = 'betaine',
  caffeine_unused = 'caffeine',
  calcium = 'calcium',
  calories = 'calories',
  totalCarbs = 'carbs',
  totalAvailableCarbs = 'carbs',
  carbsByDifference = 'carbs',
  cholesterol = 'cholesterol',
  choline_unused = 'choline',
  copper = 'copper',
  cystine = 'cystine',
  dhaFattyAcid_unused = 'dhaFattyAcid',
  dpaFattyAcid_unused = 'dpaFattyAcid',
  epaFattyAcid_unused = 'epaFattyAcid',
  fats = 'fats',
  fiber = 'fiber',
  fluoride_unused = 'fluoride',
  folate = 'folate',
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
  lycopene_unused = 'lycopene',
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
  theobromine_unused = 'theobromine',
  thiamine = 'thiamine',
  threonine = 'threonine',
  totalOmega3_unused = 'totalOmega3',
  totalOmega6_unused = 'totalOmega6',
  transFats_unused = 'transFats',
  tryptophan = 'tryptophan',
  tyrosine = 'tyrosine',
  valine = 'valine',
  vitA = 'vitA',
  vitAIU_unused = 'vitAIU',
  vitB12 = 'vitB12',
  vitB6 = 'vitB6',
  vitC = 'vitC',
  vitCLAscorbic = 'vitC',
  vitCLDehydroascorbic = 'vitC',
  vitD = 'vitD',
  vitD2 = 'vitD2',
  vitD3 = 'vitD3',
  vitDUI_unused = 'vitDUI',
  vitE = 'vitE',
  vitK = 'vitK',
  water_unused = 'water',
  zinc = 'zinc',
}

const NUTRITION_ARRAY: { name: string, field: N | null }[] = [
  /**
   * Nutrients (all of theem)
   * */
  { name: 'FAT', field: N.fats },
  { name: 'Protein, total', field: N.proteins },
  { name: 'Protein, total-N', field: N.proteinsTotalN },
  { name: 'Protein', field: N.proteins },
  { name: 'PROTEIN|PROTEINS', field: N.proteins },
  { name: 'Adjusted Protein', field: N.proteins }, // DOUBT: are adjusted proteins the same thing as proteins?
  { name: 'Carbohydrates, total available', field: N.totalAvailableCarbs },
  { name: 'Carbohydrates, total', field: N.totalCarbs },
  { name: 'Carbohydrate, by difference', field: N.carbsByDifference }, // DOUBT: do we really need to separate this?
  { name: 'CARBOHYDRATES', field: N.totalCarbs }, // DOUBT
  { name: 'CARBOHYDRATE', field: N.totalCarbs }, // DOUBT
  { name: 'CARBOHYDRATE|CARBOHYDRATES', field: N.totalCarbs }, // DOUBT
  { name: 'Fat, total (Lipids)', field: N.fats },
  { name: 'Total lipid (fat)', field: N.fats },
  { name: 'FATTY-ACIDS', field: N.fats }, // DOUBT
  { name: 'Fiber, dietary', field: N.fiber },
  { name: 'Fiber, total dietary (AOAC)', field: N.fiber },
  { name: 'Fiber, total dietary', field: N.fiber },
  { name: 'FIBER(DIETARY)', field: N.fiber },
  { name: '13:0', field: null },
  { name: '14:1', field: null },
  { name: '15:1', field: null },
  { name: '16:1 c', field: null },
  { name: '16:1 t', field: null },
  { name: '16:1 undifferentiated', field: null },
  { name: '17:1', field: null },
  { name: '18:1 c', field: null },
  { name: '18:1 t', field: null },
  { name: '18:1 undifferentiated', field: null },
  { name: '18:2 CLAs', field: null },
  { name: '18:2 i', field: null },
  { name: '18:2 t not further defined', field: null },
  { name: '18:2 t,t', field: null },
  { name: '18:2 undifferentiated', field: null },
  { name: '18:3 undifferentiated', field: null },
  { name: '18:3i', field: null },
  { name: '18:4', field: null },
  { name: '20:1', field: null },
  { name: '20:2 n-6 c,c', field: null },
  { name: '20:3 n-3', field: null },
  { name: '20:3 n-6', field: null },
  { name: '20:3 undifferentiated', field: null },
  { name: '20:4 undifferentiated', field: null },
  { name: '21:5', field: null },
  { name: 'C22:0', field: null },
  { name: '22:0', field: null },
  { name: '22:1 c', field: null },
  { name: '22:1 t', field: null },
  { name: '22:1 undifferentiated', field: null },
  { name: '22:4', field: null },
  { name: 'C22:5, n-3', field: null },
  { name: '22:5 n-3 (DPA)', field: null },
  { name: '24:1 c', field: null },
  { name: 'Energy', field: N.calories },

  /**
   * Compounds (not all of them)
   * */
  { name: 'Fatty acids, total saturated', field: N.saturatedFats },
  { name: 'Fatty acids, total mono-unsaturated', field: N.monounsaturatedFats },
  { name: 'Fatty acids, total poly-unsaturated', field: N.polyunsaturatedFats },
  { name: 'Carbohydrates, added sugar (sucrose)', field: N.sucrose },
  { name: 'Alcohol (ethanol)', field: N.alcohol },
  { name: 'Ash', field: null },
  { name: 'Moisture', field: null },
  { name: 'Vitamin A, total', field: N.vitA },
  { name: 'Vitamin A (retinol)', field: N.retinol },
  { name: 'Carotene, beta', field: N.betaCarotene },
  { name: 'Vitamin D', field: N.vitD },
  { name: 'Vitamin D3 (cholecalciferol)', field: N.vitD3 },
  { name: 'Vitamin D2 (ergocalciferol)', field: N.vitD2 },
  { name: 'Vitamin E, total', field: N.vitE },
  { name: 'Vitamin E, alpha tocopherol', field: N.vitE }, // DOUBT!
  { name: 'Vitamin K, phylloquinone (K1)', field: N.vitK },
  { name: 'Vitamin B1 (as thiamin hydrochloride)', field: N.thiamine }, // DOUBT!
  { name: 'Vitamin B2 (riboflavin)', field: N.riboflavin }, // DOUBT!
  { name: 'Niacin, total', field: N.totalNiacin },
  { name: 'Niacin', field: N.niacin },
  { name: 'Niacin, from tryptophan', field: N.niacinFromTryptophan },
  { name: 'Vitamin B6 (as pyridoxinehydrochloride), total', field: N.vitB6 },
  { name: 'Pantothenic acid', field: N.pantothenicAcid },
  { name: 'Biotin', field: null },
  { name: 'Folates', field: N.folate },
  { name: 'Vitamin B12 (as cyanocobalamin)', field: N.vitB12 },

  { name: 'Vitamin C, total', field: N.vitC },
  { name: 'Vitamin C, L-ascorbic acid', field: N.vitCLAscorbic },
  { name: 'Vitamin C, L-dehydroascorbic acid', field: N.vitCLDehydroascorbic },

  { name: 'Sodium (Na)', field: N.sodium },
  { name: 'Potassium (K)', field: N.potassium },
  { name: 'Calcium (Ca)', field: N.calcium },
  { name: 'Magnesium (Mg)', field: N.magnesium },
  { name: 'Phosphorus (P)', field: N.phosphorus },
  { name: 'Iron (Fe)', field: N.iron },
  { name: 'Copper (Cu)', field: N.copper },
  { name: 'Zinc (Zn)', field: N.zinc },
  { name: 'Iodine (I)', field: null },
  { name: 'Manganese (Mn)', field: N.manganese },
  { name: 'Chromium (Cr)', field: null },
  { name: 'Selenium (Se)', field: N.selenium },
  { name: 'Nickel (Ni)', field: null },
  { name: 'Fructose', field: N.fructose },
  { name: 'Glucose', field: N.glucose },
  { name: 'Lactose', field: N.lactose },
  { name: 'Maltose', field: N.maltose },
  { name: 'Sucrose', field: N.sucrose },
  { name: 'Sugars, total', field: N.sugar },
  { name: 'Starch (dextrins and glycogen)', field: N.starch },

  { name: 'Cholesterol', field: N.cholesterol },
  { name: 'Isoleucine', field: N.isoleucine },
  { name: 'Leucine', field: N.leucine },
  { name: 'Lysine', field: N.lysine },
  { name: 'Methionine', field: N.methionine },
  { name: 'Cystine', field: N.cystine },
  { name: 'Phenylalanine', field: N.phenylalanine },
  { name: 'Tyrosine', field: N.tyrosine },
  { name: 'Threonine', field: N.threonine },
  { name: 'Tryptophan', field: N.tryptophan },
  { name: 'Valine', field: N.valine },
  { name: 'Arginine', field: N.arginine },
  { name: 'Histidine', field: N.histidine },
  { name: 'Alanine', field: N.alanine },
  { name: 'Aspartic acid', field: N.asparticAcid },
  { name: 'Glutamic acid', field: N.glutamicAcid },
  { name: 'Glycine', field: N.glycine },
  { name: 'Proline', field: N.proline },
  { name: 'Serine', field: N.serine },

  { name: 'C4:0', field: null },
  { name: 'C6:0', field: null },
  { name: 'C8:0', field: null },
  { name: 'C10:0', field: null },
  { name: 'C12:0', field: null },
  { name: 'C14:0', field: null },
  { name: 'C15:0', field: null },
  { name: 'C16:0', field: null },
  { name: 'C17:0', field: null },
  { name: 'C18:0', field: null },
  { name: 'C20:0', field: null },
  { name: 'C24:0', field: null },
  { name: 'C14:1, n-5', field: null },
  { name: 'C16:1, n-7', field: null },
  { name: 'C18:1, n-9', field: null },
  { name: 'C18:1, n-7', field: null },
  { name: 'C20:1, n-11', field: null },
  { name: 'C22:1, n-9', field: null },
  { name: 'C22:1, n-11', field: null },
  { name: 'C18:2, n-6', field: null },
  { name: 'C18:3, n-3', field: null },
  { name: 'C18:4, n-3', field: null },
  { name: 'C20:4, n-6', field: null },
  { name: 'C20:5, n-3', field: null },
  { name: 'C22:6, n-3', field: null },
]

function attachContentToNutrition(content: FoodContent, nutrition: Nutrition, contentOrigName: string, nutritionField: string) {
  if (content.origContentName.toString() === contentOrigName) {
    if (nutrition[nutritionField]) {
      if ((content.unit !== nutrition[nutritionField]!.unit) && nutrition[nutritionField]!.amount && content.amount) {
        console.log('=====>>>>>>>')
        console.log('content: ', content.amount, content.unit, content.origContentName)
        console.log('food nutrition: ', nutrition[nutritionField]!.amount, nutrition[nutritionField]!.unit, contentOrigName)
        throw new Error('units not equal!')
      }
    }

    let totalAmount = 0
    if (nutrition[nutritionField]) {
      totalAmount = nutrition[nutritionField]!.amount + content.amount
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

function createFoodNutritionObject(food: InstanceType<FoodSchema>): InstanceType<FoodSchema> {
  let nutrition: Partial<Nutrition> = {}

  if (food.contents) {
    food.contents.map(content => {
      NUTRITION_ARRAY.map(({ name, field }) => {
        if (field) {
          attachContentToNutrition(convertUnit(content), nutrition, name, field)
        }
      })
    })
  }

  food.nutrition = nutrition

  return food
}

export default async function main() {
  console.log('Script started.')

  let foods = await FoodModel.find()

  if (foods) {
    await Promise.all(foods.map(async food => {

      food = createFoodNutritionObject(food)
      await food.save()
    }))
  }

  console.log('Script finished.')
}
