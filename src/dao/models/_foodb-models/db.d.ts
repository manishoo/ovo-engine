/*
 * db.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// tslint:disable
import * as Sequelize from 'sequelize';


// table: compoundSubstituents
export interface compoundSubstituentsAttribute {
  id:number;
  name?:string;
  compoundId?:number;
  creatorId?:number;
  updaterId?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface compoundSubstituentsInstance extends Sequelize.Instance<compoundSubstituentsAttribute>, compoundSubstituentsAttribute { }
export interface compoundSubstituentsModel extends Sequelize.Model<compoundSubstituentsInstance, compoundSubstituentsAttribute> { }

// table: compoundExternalDescriptors
export interface compoundExternalDescriptorsAttribute {
  id:number;
  externalId?:string;
  annotations?:string;
  compoundId?:number;
  creatorId?:number;
  updaterId?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface compoundExternalDescriptorsInstance extends Sequelize.Instance<compoundExternalDescriptorsAttribute>, compoundExternalDescriptorsAttribute { }
export interface compoundExternalDescriptorsModel extends Sequelize.Model<compoundExternalDescriptorsInstance, compoundExternalDescriptorsAttribute> { }

// table: compoundAlternateParents
export interface compoundAlternateParentsAttribute {
  id:number;
  name?:string;
  compoundId?:number;
  creatorId?:number;
  updaterId?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface compoundAlternateParentsInstance extends Sequelize.Instance<compoundAlternateParentsAttribute>, compoundAlternateParentsAttribute { }
export interface compoundAlternateParentsModel extends Sequelize.Model<compoundAlternateParentsInstance, compoundAlternateParentsAttribute> { }

// table: compoundSynonyms
export interface compoundSynonymsAttribute {
  id:number;
  synonym:string;
  synonymSource:string;
  createdAt?:Date;
  updatedAt?:Date;
  sourceId?:number;
  sourceType?:string;
}
export interface compoundSynonymsInstance extends Sequelize.Instance<compoundSynonymsAttribute>, compoundSynonymsAttribute { }
export interface compoundSynonymsModel extends Sequelize.Model<compoundSynonymsInstance, compoundSynonymsAttribute> { }

// table: compounds
export interface compoundsAttribute {
  id:number;
  legacyId?:number;
  type:string;
  publicId:string;
  name:string;
  export?:number;
  state?:string;
  annotationQuality?:string;
  description?:string;
  casNumber?:string;
  meltingPoint?:string;
  proteinFormula?:string;
  proteinWeight?:string;
  experimentalSolubility?:string;
  experimentalLogp?:string;
  hydrophobicity?:string;
  isoelectricPoint?:string;
  metabolism?:string;
  keggCompoundId?:string;
  pubchemCompoundId?:string;
  pubchemSubstanceId?:string;
  chebiId?:string;
  hetId?:string;
  uniprotId?:string;
  uniprotName?:string;
  genbankId?:string;
  wikipediaId?:string;
  synthesisCitations?:string;
  generalCitations?:string;
  comments?:string;
  proteinStructureFileName?:string;
  proteinStructureContentType?:string;
  proteinStructureFileSize?:number;
  proteinStructureUpdatedAt?:Date;
  msdsFileName?:string;
  msdsContentType?:string;
  msdsFileSize?:number;
  msdsUpdatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
  createdAt?:Date;
  updatedAt?:Date;
  phenolexplorerId?:number;
  dfcId?:string;
  hmdbId?:string;
  dukeId?:string;
  drugbankId?:string;
  biggId?:number;
  eafusId?:string;
  knapsackId?:string;
  boilingPoint?:string;
  boilingPointReference?:string;
  charge?:string;
  chargeReference?:string;
  density?:string;
  densityReference?:string;
  opticalRotation?:string;
  opticalRotationReference?:string;
  percentComposition?:string;
  percentCompositionReference?:string;
  physicalDescription?:string;
  physicalDescriptionReference?:string;
  refractiveIndex?:string;
  refractiveIndexReference?:string;
  uvIndex?:string;
  uvIndexReference?:string;
  experimentalPka?:string;
  experimentalPkaReference?:string;
  experimentalSolubilityReference?:string;
  experimentalLogpReference?:string;
  hydrophobicityReference?:string;
  isoelectricPointReference?:string;
  meltingPointReference?:string;
  moldbAlogpsLogp?:string;
  moldbLogp?:string;
  moldbAlogpsLogs?:string;
  moldbSmiles?:string;
  moldbPka?:string;
  moldbFormula?:string;
  moldbAverageMass?:string;
  moldbInchi?:string;
  moldbMonoMass?:string;
  moldbInchikey?:string;
  moldbAlogpsSolubility?:string;
  moldbId?:number;
  moldbIupac?:string;
  structureSource?:string;
  duplicateId?:string;
  oldDfcId?:string;
  dfcName?:string;
  compoundSource?:string;
  flavornetId?:string;
  goodscentId?:string;
  superscentId?:string;
  phenolexplorerMetaboliteId?:number;
  kingdom?:string;
  superklass?:string;
  klass?:string;
  subklass?:string;
  directParent?:string;
  molecularFramework?:string;
  chemblId?:string;
  chemspiderId?:string;
  metaCycId?:string;
  foodcomex?:number;
  phytohubId?:string;
}
export interface compoundsInstance extends Sequelize.Instance<compoundsAttribute>, compoundsAttribute { }
export interface compoundsModel extends Sequelize.Model<compoundsInstance, compoundsAttribute> { }

// table: compoundsEnzymes
export interface compoundsEnzymesAttribute {
  id:number;
  compoundId:number;
  enzymeId:number;
  citations:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
}
export interface compoundsEnzymesInstance extends Sequelize.Instance<compoundsEnzymesAttribute>, compoundsEnzymesAttribute { }
export interface compoundsEnzymesModel extends Sequelize.Model<compoundsEnzymesInstance, compoundsEnzymesAttribute> { }

// table: compoundsFlavors
export interface compoundsFlavorsAttribute {
  id:number;
  compoundId:number;
  flavorId:number;
  citations:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
  sourceId?:number;
  sourceType?:string;
}
export interface compoundsFlavorsInstance extends Sequelize.Instance<compoundsFlavorsAttribute>, compoundsFlavorsAttribute { }
export interface compoundsFlavorsModel extends Sequelize.Model<compoundsFlavorsInstance, compoundsFlavorsAttribute> { }

// table: compoundsHealthEffects
export interface compoundsHealthEffectsAttribute {
  id:number;
  compoundId:number;
  healthEffectId:number;
  origHealthEffectName?:string;
  origCompoundName?:string;
  origCitation?:string;
  citation:string;
  citationType:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
  sourceId?:number;
  sourceType?:string;
}
export interface compoundsHealthEffectsInstance extends Sequelize.Instance<compoundsHealthEffectsAttribute>, compoundsHealthEffectsAttribute { }
export interface compoundsHealthEffectsModel extends Sequelize.Model<compoundsHealthEffectsInstance, compoundsHealthEffectsAttribute> { }

// table: compoundsPathways
export interface compoundsPathwaysAttribute {
  id:number;
  compoundId?:number;
  pathwayId?:number;
  creatorId?:number;
  updaterId?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface compoundsPathwaysInstance extends Sequelize.Instance<compoundsPathwaysAttribute>, compoundsPathwaysAttribute { }
export interface compoundsPathwaysModel extends Sequelize.Model<compoundsPathwaysInstance, compoundsPathwaysAttribute> { }

// table: contents
export interface contentsAttribute {
  id:number;
  sourceId?:number;
  sourceType?:string;
  foodId:number;
  origFoodId?:string;
  origFoodCommonName?:string;
  origFoodScientificName?:string;
  origFoodPart?:string;
  origSourceId?:string;
  origSourceName?:string;
  origContent?:number;
  origMin?:number;
  origMax?:number;
  origUnit?:string;
  origCitation?:string;
  citation:string;
  citationType:string;
  creatorId?:number;
  updaterId?:number;
  createdAt?:Date;
  updatedAt?:Date;
  origMethod?:string;
  origUnitExpression?:string;
  standardContent?:number;
}
export interface contentsInstance extends Sequelize.Instance<contentsAttribute>, contentsAttribute { }
export interface contentsModel extends Sequelize.Model<contentsInstance, contentsAttribute> { }

// table: flavors
export interface flavorsAttribute {
  id:number;
  name:string;
  flavorGroup?:string;
  category?:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
}
export interface flavorsInstance extends Sequelize.Instance<flavorsAttribute>, flavorsAttribute { }
export interface flavorsModel extends Sequelize.Model<flavorsInstance, flavorsAttribute> { }

// table: foodTaxonomies
export interface foodTaxonomiesAttribute {
  id:number;
  foodId?:number;
  ncbiTaxonomyId?:number;
  classificationName?:string;
  classificationOrder?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface foodTaxonomiesInstance extends Sequelize.Instance<foodTaxonomiesAttribute>, foodTaxonomiesAttribute { }
export interface foodTaxonomiesModel extends Sequelize.Model<foodTaxonomiesInstance, foodTaxonomiesAttribute> { }

// table: foodcomexCompoundProviders
export interface foodcomexCompoundProvidersAttribute {
  id:number;
  foodcomexCompoundId:number;
  providerId:number;
  createdAt?:Date;
  updatedAt?:Date;
}
export interface foodcomexCompoundProvidersInstance extends Sequelize.Instance<foodcomexCompoundProvidersAttribute>, foodcomexCompoundProvidersAttribute { }
export interface foodcomexCompoundProvidersModel extends Sequelize.Model<foodcomexCompoundProvidersInstance, foodcomexCompoundProvidersAttribute> { }

// table: enzymes
export interface enzymesAttribute {
  id:number;
  name:string;
  geneName?:string;
  description?:string;
  goClassification?:string;
  generalFunction?:string;
  specificFunction?:string;
  pathway?:string;
  reaction?:string;
  cellularLocation?:string;
  signals?:string;
  transmembraneRegions?:string;
  molecularWeight?:number;
  theoreticalPi?:number;
  locus?:string;
  chromosome?:string;
  uniprotName?:string;
  uniprotId?:string;
  pdbId?:string;
  genbankProteinId?:string;
  genbankGeneId?:string;
  genecardId?:string;
  genatlasId?:string;
  hgncId?:string;
  hprdId?:string;
  organism?:string;
  generalCitations?:string;
  comments?:string;
  creatorId?:number;
  updaterId?:number;
  createdAt?:Date;
  updatedAt?:Date;
}
export interface enzymesInstance extends Sequelize.Instance<enzymesAttribute>, enzymesAttribute { }
export interface enzymesModel extends Sequelize.Model<enzymesInstance, enzymesAttribute> { }

// table: foods
export interface foodsAttribute {
  id:number;
  name:string;
  nameScientific?:string;
  description?:string;
  itisId?:string;
  wikipediaId?:string;
  pictureFileName?:string;
  pictureContentType?:string;
  pictureFileSize?:number;
  pictureUpdatedAt?:Date;
  legacyId?:number;
  foodGroup:string;
  foodSubgroup:string;
  foodType:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
  exportToAfcdb:number;
  category?:string;
  ncbiTaxonomyId?:number;
  exportToFoodb?:number;
}
export interface foodsInstance extends Sequelize.Instance<foodsAttribute>, foodsAttribute { }
export interface foodsModel extends Sequelize.Model<foodsInstance, foodsAttribute> { }

// table: healthEffects
export interface healthEffectsAttribute {
  id:number;
  name:string;
  description?:string;
  chebiName?:string;
  chebiId?:string;
  createdAt?:Date;
  updatedAt?:Date;
  creatorId?:number;
  updaterId?:number;
  chebiDefinition?:string;
}
export interface healthEffectsInstance extends Sequelize.Instance<healthEffectsAttribute>, healthEffectsAttribute { }
export interface healthEffectsModel extends Sequelize.Model<healthEffectsInstance, healthEffectsAttribute> { }

// table: foodcomexCompounds
export interface foodcomexCompoundsAttribute {
  id:number;
  compoundId:number;
  origin?:string;
  storageForm?:string;
  maximumQuantity?:string;
  storageCondition?:string;
  contactName?:string;
  contactAddress?:string;
  contactEmail?:string;
  createdAt:Date;
  updatedAt:Date;
  export?:number;
  purity?:string;
  description?:string;
  spectraDetails?:string;
  deliveryTime?:string;
  stability?:string;
  adminUserId?:number;
  publicId:string;
  casNumber?:string;
  taxonomyClass?:string;
  taxonomyFamily?:string;
  experimentalLogp?:string;
  experimentalSolubility?:string;
  meltingPoint?:string;
  foodOfOrigin?:string;
  productionMethodReferenceText?:string;
  productionMethodReferenceFileName?:string;
  productionMethodReferenceContentType?:string;
  productionMethodReferenceFileSize?:number;
  productionMethodReferenceUpdatedAt?:Date;
  elementalFormula?:string;
  minimumQuantity?:string;
  quantityUnits?:string;
  availableSpectra?:string;
  storageConditions?:string;
}
export interface foodcomexCompoundsInstance extends Sequelize.Instance<foodcomexCompoundsAttribute>, foodcomexCompoundsAttribute { }
export interface foodcomexCompoundsModel extends Sequelize.Model<foodcomexCompoundsInstance, foodcomexCompoundsAttribute> { }

// table: nutrients
export interface nutrientsAttribute {
  id:number;
  legacyId?:number;
  type:string;
  publicId:string;
  name:string;
  export?:number;
  state?:string;
  annotationQuality?:string;
  description?:string;
  wikipediaId?:string;
  comments?:string;
  dfcId?:string;
  dukeId?:string;
  eafusId?:string;
  dfcName?:string;
  compoundSource?:string;
  metabolism?:string;
  synthesisCitations?:string;
  generalCitations?:string;
  creatorId?:number;
  updaterId?:number;
  createdAt?:Date;
  updatedAt?:Date;
}
export interface nutrientsInstance extends Sequelize.Instance<nutrientsAttribute>, nutrientsAttribute { }
export interface nutrientsModel extends Sequelize.Model<nutrientsInstance, nutrientsAttribute> { }

// table: pathways
export interface pathwaysAttribute {
  id:number;
  smpdbId?:string;
  keggMapId?:string;
  name?:string;
  createdAt?:Date;
  updatedAt?:Date;
}
export interface pathwaysInstance extends Sequelize.Instance<pathwaysAttribute>, pathwaysAttribute { }
export interface pathwaysModel extends Sequelize.Model<pathwaysInstance, pathwaysAttribute> { }

// table: references
export interface referencesAttribute {
  id:number;
  refType?:string;
  text?:string;
  pubmedId?:string;
  link?:string;
  title?:string;
  creatorId?:number;
  updaterId?:number;
  createdAt:Date;
  updatedAt:Date;
  sourceId?:number;
  sourceType?:string;
}
export interface referencesInstance extends Sequelize.Instance<referencesAttribute>, referencesAttribute { }
export interface referencesModel extends Sequelize.Model<referencesInstance, referencesAttribute> { }
