/*
 * food-database-tables.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import * as path from 'path'
import * as sequelize from 'sequelize'
import * as def from '../../types/food-database'


export interface ITables {
  CompoundSubstituent: def.compoundSubstituentsModel;
  CompoundExternalDescriptor: def.compoundExternalDescriptorsModel;
  CompoundAlternateParent: def.compoundAlternateParentsModel;
  CompoundSynonym: def.compoundSynonymsModel;
  Compound: def.compoundsModel;
  CompoundsEnzyme: def.compoundsEnzymesModel;
  CompoundsFlavor: def.compoundsFlavorsModel;
  CompoundsHealthEffect: def.compoundsHealthEffectsModel;
  CompoundsPathway: def.compoundsPathwaysModel;
  Content: def.contentsModel;
  Flavor: def.flavorsModel;
  FoodTaxonomy: def.foodTaxonomiesModel;
  FoodcomexCompoundProvider: def.foodcomexCompoundProvidersModel;
  Enzyme: def.enzymesModel;
  Food: def.foodsModel;
  FoodVariety: def.foodVarietyModel;
  // FoodTr: def.foodsTrModel;
  FoodGroup: def.foodGroupModel;
  // FoodGroupTr: def.foodGroupTrModel;
  Weight: def.weightModel;
  // WeightTr: def.weightTrModel;
  HealthEffect: def.healthEffectsModel;
  FoodcomexCompound: def.foodcomexCompoundsModel;
  Nutrient: def.nutrientsModel;
  Pathway: def.pathwaysModel;
  Reference: def.referencesModel;
  Translation: def.translationInstanceModel;
}

export const getModels = function (seq: sequelize.Sequelize): ITables {
  return {
    CompoundSubstituent: seq.import(path.join(__dirname, './compound_substituents')),
    CompoundExternalDescriptor: seq.import(path.join(__dirname, './compound_external_descriptors')),
    CompoundAlternateParent: seq.import(path.join(__dirname, './compound_alternate_parents')),
    CompoundSynonym: seq.import(path.join(__dirname, './compound_synonyms')),
    Compound: seq.import(path.join(__dirname, './compounds')),
    CompoundsEnzyme: seq.import(path.join(__dirname, './compounds_enzymes')),
    CompoundsFlavor: seq.import(path.join(__dirname, './compounds_flavors')),
    CompoundsHealthEffect: seq.import(path.join(__dirname, './compounds_health_effects')),
    CompoundsPathway: seq.import(path.join(__dirname, './compounds_pathways')),
    Content: seq.import(path.join(__dirname, './contents')),
    Flavor: seq.import(path.join(__dirname, './flavors')),
    FoodTaxonomy: seq.import(path.join(__dirname, './food_taxonomies')),
    FoodcomexCompoundProvider: seq.import(path.join(__dirname, './foodcomex_compound_providers')),
    Enzyme: seq.import(path.join(__dirname, './enzymes')),
    Food: seq.import(path.join(__dirname, './foods')),
    FoodVariety: seq.import(path.join(__dirname, './food_varieties')),
    // FoodTr: seq.import(path.join(__dirname, './foods_tr')),
    FoodGroup: seq.import(path.join(__dirname, './food_groups')),
    // FoodGroupTr: seq.import(path.join(__dirname, './food_group_translation')),
    Weight: seq.import(path.join(__dirname, './weights')),
    // WeightTr: seq.import(path.join(__dirname, './weights_tr')),
    HealthEffect: seq.import(path.join(__dirname, './health_effects')),
    FoodcomexCompound: seq.import(path.join(__dirname, './foodcomex_compounds')),
    Nutrient: seq.import(path.join(__dirname, './nutrients')),
    Pathway: seq.import(path.join(__dirname, './pathways')),
    Reference: seq.import(path.join(__dirname, './references')),
    Translation: seq.import(path.join(__dirname, './translations')),
  }
}
