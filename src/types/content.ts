/*
 * content.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Translation } from '@Types/common'
import mongoose from 'mongoose'
import { Field, ObjectType } from 'type-graphql'


export enum CONTENT_TYPE {
  Nutrient = 'Nutrient',
  Compound = 'Compound',
}

@ObjectType()
export class Synonym {
  @Field()
  synonymName: string
  @Field()
  synonymSource: string
}

@ObjectType()
export class Content {
  _id: mongoose.Types.ObjectId

  @Field()
  id: string
  @Field()
  type: CONTENT_TYPE
  @Field(type => String)
  name: Translation[]

  origId?: number
  synonyms: Synonym[]
  flavors: mongoose.Types.ObjectId[]
  healthEffects: mongoose.Types.ObjectId[]
  pathways: mongoose.Types.ObjectId[]
  enzymes: mongoose.Types.ObjectId[]
  state?: string

  annotationQuality?: string
  description?: string
  casNumber?: string
  meltingPoint?: string
  proteinFormula?: string
  proteinWeight?: string
  experimentalSolubility?: string
  experimentalLogp?: string
  hydrophobicity?: string
  isoelectricPoint?: string
  metabolism?: string
  keggCompoundId?: string
  pubchemCompoundId?: string
  pubchemSubstanceId?: string
  chebiId?: string
  hetId?: string
  uniprotId?: string
  uniprotName?: string
  genbankId?: string
  wikipediaId?: string
  synthesisCitations?: string
  generalCitations?: string
  comments?: string
  proteinStructureFileName?: string
  proteinStructureContentType?: string
  proteinStructureFileSize?: number
  proteinStructureUpdatedAt?: Date
  msdsFileName?: string
  msdsContentType?: string
  msdsFileSize?: number
  msdsUpdatedAt?: Date
  phenolexplorerId?: number
  dfcId?: string
  hmdbId?: string
  dukeId?: string
  drugbankId?: string
  biggId?: number
  eafusId?: string
  knapsackId?: string
  boilingPoint?: string
  boilingPointReference?: string
  charge?: string
  chargeReference?: string
  density?: string
  densityReference?: string
  opticalRotation?: string
  opticalRotationReference?: string
  percentComposition?: string
  percentCompositionReference?: string
  physicalDescription?: string
  physicalDescriptionReference?: string
  refractiveIndex?: string
  refractiveIndexReference?: string
  uvIndex?: string
  uvIndexReference?: string
  experimentalPka?: string
  experimentalPkaReference?: string
  experimentalSolubilityReference?: string
  experimentalLogpReference?: string
  hydrophobicityReference?: string
  isoelectricPointReference?: string
  meltingPointReference?: string
  moldbAlogpsLogp?: string
  moldbLogp?: string
  moldbAlogpsLogs?: string
  moldbSmiles?: string
  moldbPka?: string
  moldbFormula?: string
  moldbAverageMass?: string
  moldbInchi?: string
  moldbMonoMass?: string
  moldbInchikey?: string
  moldbAlogpsSolubility?: string
  moldbId?: number
  moldbIupac?: string
  structureSource?: string
  duplicateId?: string
  oldDfcId?: string
  dfcName?: string
  compoundSource?: string
  flavornetId?: string
  goodscentId?: string
  superscentId?: string
  phenolexplorerMetaboliteId?: number
  kingdom?: string
  superklass?: string
  klass?: string
  subklass?: string
  directParent?: string
  molecularFramework?: string
  chemblId?: string
  chemspiderId?: string
  metaCycId?: string
  foodcomex?: number
  phytohubId?: string
}
