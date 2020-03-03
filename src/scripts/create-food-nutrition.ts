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
  cholesterol = 'cholesterol',
  choline = 'choline',
  copper = 'copper',
  cystine = 'cystine',
  fats = 'fats',
  fiber = 'fiber',
  fluoride = 'fluoride',
  folate = 'folate',
  folateFood = 'folateFood',
  folateDFE = 'folateDFE',
  fructose = 'fructose',
  galactose = 'galactose',
  glucose = 'glucose',
  glutamicAcid = 'glutamicAcid',
  glycine = 'glycine',
  histidine = 'histidine',
  hydroxyproline = 'hydroxyproline',
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
  omega3 = 'omega3',
  omega6 = 'omega6',
  ALA = 'ALA',
  DHA = 'DHA',
  EPA = 'EPA',
  DPA = 'DPA',
  transFats = 'transFats',
  tryptophan = 'tryptophan',
  tyrosine = 'tyrosine',
  valine = 'valine',
  vitA = 'vitA',
  vitARAE = 'vitARAE',
  vitAIU = 'vitAIU',
  vitB12 = 'vitB12',
  vitB6 = 'vitB6',
  vitC = 'vitC',
  vitCLAscorbic = 'vitCLAscorbic',
  vitCLDehydroascorbic = 'vitCLDehydroascorbic',
  vitD = 'vitD',
  vitD2andD3 = 'vitD2andD3',
  vitD2 = 'vitD2',
  vitD3 = 'vitD3',
  vitE = 'vitE',
  vitK = 'vitK',
  water = 'water',
  zinc = 'zinc',
  null = 'null'
}

const NUTRITIONS: { [k: string]: string | string[] | null } = {
  'FAT': N.fats,
  'Protein, total': N.proteins,
  'Protein, total-N': N.proteinsTotalN,
  'Protein': N.proteins,
  'PROTEIN|PROTEINS': N.proteins,
  'Adjusted Protein': N.proteins,

  'Carbohydrates, total available': N.totalAvailableCarbs,
  'Carbohydrates, total': N.totalCarbs,
  'Carbohydrate, by difference': N.totalCarbs,
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
  '22:5 n-3 (DPA)': N.DPA,
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
  'C18:2, n-6': N.omega6,
  'C18:3, n-3': N.omega3,
  'C18:4, n-3': N.omega3,
  'C20:4, n-6': N.omega6,
  'C20:5, n-3': N.omega3,
  'C22:6, n-3': N.omega3,

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
  'Vitamin A': N.vitA,
  'Vitamin A, IU': N.vitAIU,
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
  '22:6 n-3 (DHA)': N.DHA,
  '20:5 n-3 (EPA)': N.EPA,
  'Fatty acids, total monounsaturated': N.monounsaturatedFats,
  'Fatty acids, total polyunsaturated': N.polyunsaturatedFats,

  '15:0': null,
  '17:0': null,
  '24:0': null,
  '18:2 n-6 c,c': null,
  '18:3 n-6 c,c,c': null,
  '18:3 n-3 c,c,c (ALA)': N.ALA,
  'Menaquinone-4': null,

  'Fluoride, F': N.fluoride,
  'FLUORIDE': N.fluoride,
  'Hydroxyproline': N.hydroxyproline,

  // trans fatty acids FIXME VERY BAD!
  'TRANS-1-(1-PROPENYL-DITHIO)-PROPANE': N.transFats,
  'TRANS-2,3-DIMETHYL-5,6-DITHIA-CYCLO(2,2,1)HEPTANE-5-OXIDE': N.transFats,
  'TRANS-3,5-DIETHYL-1,2,4,-TRITHIOLANE': N.transFats,
  'TRANS-5-ETHYL-4,6,7-TRITHIA-2-DECENE-4-S-OXIDE': N.transFats,
  'TRANS-CIS-5-ETHYL-4,6,7-TRITHIA-2,8-DECADIENE-4-S-OXIDE': N.transFats,
  'TRANS-METHYLSULPHINOTHIOIC-ACID-S-1-PROPENYLESTER': N.transFats,
  'TRANS-N-PROPYLSULPHINOTHIOIC-ACID-S-1-PROPENYLESTER': N.transFats,
  'TRANS-S-(1-PROPENYL)-CYSTEINE-SULFOXIDE': N.transFats,
  'TRANS-TRANS-5-ETHYL-4,6,7-TRITHIA-2,8-DECADIENE-4-S-OXIDE': N.transFats,
  'TRANS-PENTYL-HYDRO-DISULFIDE': N.transFats,
  'TRANS-PROPYL-2-PROPENYLDISULFIDE': N.transFats,
  'TRANS-PROPENYL-PROPYL-DISULFIDE': N.transFats,
  'TRANS-HEX-2-ENAL': N.transFats,
  'TRANS-TETRAHYDRO-ALPHA-ALPHA-5-TRIMETHYL-5-VINYLFURFURYL-ALC': N.transFats,
  'TRANS-BETA-OCIMENE': N.transFats,
  'TRANS-ANETHOLE': N.transFats,
  'TRANS-CARVEOL': N.transFats,
  'TRANS-DIHYDROCARVONE': N.transFats,
  'TRANS-P-MENTHA-2-EN-OL': N.transFats,
  'TRANS-2-HEXEN-1-OL': N.transFats,
  'TRANS-OCIMENE': N.transFats,
  'TRANS-BETA-OCIMENE|TRANS-OCIMENE': N.transFats,
  'TRANS-LIMONENE-OXIDE': N.transFats,
  'TRANS-1,2-EPOXYLIMONENE': N.transFats,
  'TRANS-CARVYL-ACETATE': N.transFats,
  'TRANS-P-MENTHA-1(7),8-DIEN-2-OL': N.transFats,
  'TRANS-P-MENTHA-2,8-DIEN-1-OL': N.transFats,
  'TRANS-2-HEXENOL': N.transFats,
  'TRANS-RESVERATROL': N.transFats,
  'TRANS-10-OCTADECENOIC-ACID': N.transFats,
  'TRANS-ALLO-OCIMENE': N.transFats,
  'TRANS-LINALOOL-OXIDE': N.transFats,
  'TRANS-METHYL-ISOEUGENOL': N.transFats,
  'TRANS-DEHYDROMATRICARIA-ESTER': N.transFats,
  'TRANS-NON-2-EN-1-AL': N.transFats,
  'TRANS-HEPT-2-ENAL': N.transFats,
  'TRANS-FERULIC-ACID': N.transFats,
  'TRANS-2-OCTENAL': N.transFats,
  'TRANS-GERANIC-ACID': N.transFats,
  'TRANS-1-CARVEOL': N.transFats,
  'TRANS-CARYOPHYLLENE-OXIDE': N.transFats,
  'TRANS-LIMONENE-DIEPOXIDE': N.transFats,
  'TRANS-LIMONENE-EPOXIDE': N.transFats,
  'TRANS-ZEATIN': N.transFats,
  'TRANS-2-METHOXY-CINNAMALDEHYDE': N.transFats,
  'TRANS-2-METHOXY-CINNAMIC-ACID': N.transFats,
  'TRANS-CINNAMALDEHYDE': N.transFats,
  'TRANS-CINNAMIC-ACID': N.transFats,
  'TRANS-LINALOL-OXIDE': N.transFats,
  'TRANS-LIMONENE-1,2-OXIDE': N.transFats,
  'TRANS-SABINENE-HYDRATE': N.transFats,
  'TRANS-2-HEXENAL': N.transFats,
  'TRANS-P-COUMARIC-ACID': N.transFats,
  'TRANS-2-DECANAL': N.transFats,
  'TRANS-2-DODECANAL': N.transFats,
  'TRANS-TRIDEC-2-EN-1-AL': N.transFats,
  'TRANS-TRIDECEN-(2)-AL-(1)': N.transFats,
  'TRANS-CITRAL': N.transFats,
  'TRANS-ZEAXANTHIN|ZEAXANTHIN': N.transFats,
  'TRANS-ALPHA-BERGAMOTENE': N.transFats,
  'TRANS-PINOCARVEOL': N.transFats,
  'TRANS-CHLOROGENIC-ACID': N.transFats,
  'TRANS-BETA-BERGAPTENE': N.transFats,
  'TRANS-1,10-HEPTADECADIENE-5,7-DIYN-3-OL': N.transFats,
  'TRANS-2(7)-2,6-DIMETHYLOCTA-4,6-DIENE': N.transFats,
  'TRANS-ISOASARONE': N.transFats,
  'TRANS-GAMMA-BISABOLENE': N.transFats,
  'TRANS-P-MENTH-2-EN-1-OL': N.transFats,
  'TRANS-2-NONENAL': N.transFats,
  'TRANS-BETA-FARNESENE': N.transFats,
  'TRANS-CARYOPHYLLENE': N.transFats,
  'TRANS-1,8-TERPIN': N.transFats,
  'TRANS-ACONITIC-ACID': N.transFats,
  'TRANS-ABSCISIC-ACID': N.transFats,
  'TRANS-5,6-LUTEIN-EPOXIDE': N.transFats,
  'TRANS-NEROLIDOL': N.transFats,
  'TRANS-METHYL-EUGENOL': N.transFats,
  'TRANS-CAFFEIC-ACID': N.transFats,
  'TRANS-LINOLEIC-ACID-METHYL-ESTER': N.transFats,
  'TRANS-EN-YN-DICYCLOETHER': N.transFats,
  'TRANS-ROSE-OXIDE': N.transFats,
  'TRANS-2-HEPTANAL': N.transFats,
  'TRANS-BETA-COPAENE': N.transFats,
  'TRANS-CARVEOL-ACETATE': N.transFats,
  'TRANS-CARVYL-FORMATE': N.transFats,
  'TRANS-JASMONE': N.transFats,
  'TRANS-VERBENOL': N.transFats,
  'TRANS-CARVONE-OXIDE': N.transFats,
  'TRANS-PIPERITOL': N.transFats,
  'TRANS-ISOEUGENOL': N.transFats,
  'TRANS-P-MENTH-2-ENOL': N.transFats,
  'TRANS-3-ETHOXY-1-P-MENTHENE': N.transFats,
  'TRANS-3-ETHOXY-P-MENTH-1-ENE': N.transFats,
  'TRANS-4-ETHOXY-THUJANE': N.transFats,
  'TRANS-SABINENE-HYDRATE-METHYL-ETHER': N.transFats,
  'TRANS-Z-P-MENTHEN-1-OL': N.transFats,
  'TRANS-THUJANOL': N.transFats,
  'TRANS-SINAPIC-ACID': N.transFats,
  'TRANS-EPOXYDIHYDROLINALOOL': N.transFats,
  'TRANS-2-HEXENYL-ACETATE': N.transFats,
  'TRANS-P-COUMAROYLQUINIC-ACID': N.transFats,
  'TRANS-2,TRANS-4-DECADIENIC-ACID-ETHYL-ESTER': N.transFats,
  'TRANS-2,TRANS-4-DECADIENIC-ACID-METHYL-ESTER': N.transFats,
  'TRANS-2-DECADIENIC-ACID-ETHYL-ESTER': N.transFats,
  'TRANS-2-DECADIENIC-ACID-METHYL-ESTER': N.transFats,
  'TRANS-CAFFEOYLARBUTIN': N.transFats,
  'TRANS-ISOCHLOROGENIC-ACID': N.transFats,
  'TRANS-NEOCHLOROGENIC-ACID': N.transFats,
  'TRANS-CAFFEOYLCALLERYANIN': N.transFats,
  'TRANS-HEX-2-EN-1-OL': N.transFats,
  'TRANS-MYRTENOL': N.transFats,
  'TRANS-BETA-TERPINEOL': N.transFats,
  'TRANS-2-PHENYLBUTANONE': N.transFats,
  'TRANS-SABINOL': N.transFats,
  'TRANS-SALVENE': N.transFats,
  'TRANS-3-HEXENAL': N.transFats,
  'TRANS-NONEN-2-OL': N.transFats,
  'TRANS-OCTEN-2-AL': N.transFats,
  'TRANS-OCTEN-2-OL': N.transFats,
  'TRANS-N-FEROLOYL-PUTRESCINE': N.transFats,
  'TRANS-TARAXANTHIN': N.transFats,
  'TRANS-LUTEIN-5,6-EPOXIDE': N.transFats,
  'TRANS-4-THUJANOL': N.transFats,
  'TRANS-CINNAMYL-ALCOHOL': N.transFats,
  'TRANS-COUTARIC-ACID': N.transFats,
  'TRANS-CAFTARIC-ACID': N.transFats,
  'TRANS-24-METHYL-23-DEHYDRO-LOPHENOL': N.transFats,
  'TRANS-10-SHOGAOL': N.transFats,
  'TRANS-12-SHOGAOL': N.transFats,
  'TRANS-3-(2-4-5-TRIMETHOXY-PHENYL)-4-(TRANS-3-4-DIMETHOXY-STYRYL)-CYCLOHEXENE': N.transFats,
  'TRANS-3-(3-4-DIMETHOXY-PHENYL)-4-(TRANS-3-4-DIMETHOXY-STYRYL)-CYCLOHEXENE': N.transFats,
  'TRANS-6-SHOGAOL': N.transFats,
  'TRANS-8-SHOGAOL': N.transFats,
  'TRANS-BETA-SESQUIPHELLANDROL': N.transFats,
  'trans-p-Feruloyl-beta-D-glucopyranoside': N.transFats,
  'trans-p-Ferulyl alcohol 4-O-[6-(2-methyl-3-hydroxypropionyl)] glucopyranoside': N.transFats,
  'trans-p-Coumaroyl beta-D-glucopyranoside': N.transFats,
  'trans-p-Coumaric acid': N.transFats,
  'trans-Anethol': N.transFats,
  'trans-Cinnamic acid': N.transFats,
  'trans-(-)-p-Mentha-1(7),5-dien-2-ol': N.transFats,
  'trans-p-Sinapoyl beta-D-glucopyranoside': N.transFats,
  'TRANS-2-NONEN-1-OL': N.transFats,
  'TRANS-1-PROPENYL-ALLYL-THIOSULFINATE': N.transFats,
  'TRANS-1-PROPENYL-METHYL-THIOSULFINATE': N.transFats,
  'TRANS-S-(PROPENYL-1-YL)-CYSTEINE-DISULFIDE': N.transFats,
  'TRANS-1-PROPENYL-METHYL-DISULFIDE': N.transFats,

  // omega-3
  'ALPHA-LINOLENIC-ACID': N.omega3,
  'HEXADECATRIENOIC-ACID': N.omega3,
  'STEARIDONIC ACID': N.omega3,

  // '11,12-Epoxyeicosatrienoic acid': N.omega3,
  // '14,15-Epoxy-5,8,11-eicosatrienoic acid': N.omega3,
  // '15(S)-Hydroxyeicosatrienoic acid': N.omega3,
  // '2,4,14-Eicosatrienoic acid isobutylamide': N.omega3,
  // '2,4,8-Eicosatrienoic acid isobutylamide': N.omega3,
  // '5,6-Epoxy-8,11,14-eicosatrienoic acid': N.omega3,
  // '5,8,11-Eicosatrienoic acid': N.omega3,
  // '8,11,14-Eicosatrienoic acid': N.omega3,
  // '8,9-Epoxyeicosatrienoic acid': N.omega3,

  // 'cis-8,11,14,17-Eicosatetraenoic acid': N.omega3,
  'EICOSAPENTAENOIC-ACID': N.omega3,

  // '4,8,12,15,19-Docosapentaenoic acid': N.omega3,
  // '7Z,10Z,13Z,16Z,19Z-Docosapentaenoic acid': N.omega3, //clupanodonic acid

  // 'Docosapentaenoic acid': [N.DPA, N.omega3, N.omega6],

  // 'Tetracosapentaenoic acid (24:5n-3)': N.omega3,

  // '6,9,12,15,18,21-Tetracosahexaenoic acid': N.omega3,
  // 'Tetracosahexaenoic acid': N.omega3,

  // omega-6
  'LINOLENIC-ACID': N.omega6,
  'CIS-LINOLENIC-ACID': N.omega6,

  'CIS-GAMMA-LINOLEIC-ACID': N.omega6,
  // 'Calendic acid': N.omega6,
  'EICOSADIENOIC-ACID': N.omega6,
  // 'Dihomolinolenic acid': N.omega6,
  'ARACHIDONIC-ACID': N.omega6,
  // 'Adrenic acid': N.omega6,
  // '4,7,10,13,16-Docosapentaenoic acid': N.omega6, //osbond acid
  // 'Tetracosatetraenoic acid (24:4n-6)': N.omega6,
  // 'Tetracosapentaenoic acid (24:5n-6)': N.omega6,

}

function attachContentToNutrition(content: FoodContent, nutrition: Nutrition, contentOrigName: string, nutritionField: string | string[]) {
  if (!(content.origContentName && (content.origContentName.toString() === contentOrigName))) return
  if (Array.isArray(nutritionField)) {
    nutritionField.forEach(nf => {
      if (nutrition[nf]) {
        if ((content.unit !== nutrition[nf]!.unit) && nutrition[nf]!.amount && content.amount) {
          console.log('=====>>>>>>>')
          console.log('content: ', content.amount, content.unit, content.origContentName)
          console.log('food nutrition: ', nutrition[nf]!.amount, nutrition[nf]!.unit, contentOrigName)
          throw new Error('units not equal!')
        }
      }

      let totalAmount = content.amount
      if (nutrition[nf]) {
        totalAmount += nutrition[nf]!.amount + content.amount
      }

      nutrition[nf] = {
        id: String(content.content),
        amount: totalAmount,
        unit: content.unit
      }
    })
  } else {
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

  const arrays = []
  const size = 500

  while (foods.length > 0) {
    arrays.push(foods.splice(0, size))
  }

  for (let i = 0; i < arrays.length; i++) {
    await Promise.all(arrays[i].map(async food => {
      food.nutrition = createFoodNutritionFromContents(food.contents)
      await food.save()
    }))
    process.stdout.write('.')
  }

  console.log('Script finished.')
}

if (argv.run) {
  main()
    .then(() => {
      console.log('DONE')
    })
}
