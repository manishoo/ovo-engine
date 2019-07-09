/*
 * db.tables.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// tslint:disable
import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  compoundSubstituents:def.compoundSubstituentsModel;
  compoundExternalDescriptors:def.compoundExternalDescriptorsModel;
  compoundAlternateParents:def.compoundAlternateParentsModel;
  compoundSynonyms:def.compoundSynonymsModel;
  compounds:def.compoundsModel;
  compoundsEnzymes:def.compoundsEnzymesModel;
  compoundsFlavors:def.compoundsFlavorsModel;
  compoundsHealthEffects:def.compoundsHealthEffectsModel;
  compoundsPathways:def.compoundsPathwaysModel;
  contents:def.contentsModel;
  flavors:def.flavorsModel;
  foodTaxonomies:def.foodTaxonomiesModel;
  foodcomexCompoundProviders:def.foodcomexCompoundProvidersModel;
  enzymes:def.enzymesModel;
  foods:def.foodsModel;
  healthEffects:def.healthEffectsModel;
  foodcomexCompounds:def.foodcomexCompoundsModel;
  nutrients:def.nutrientsModel;
  pathways:def.pathwaysModel;
  references:def.referencesModel;
}

export const getModels = function(seq:sequelize.Sequelize):ITables {
  return {
		compoundSubstituents: seq.import(path.join(__dirname, './compound_substituents')),
		compoundExternalDescriptors: seq.import(path.join(__dirname, './compound_external_descriptors')),
		compoundAlternateParents: seq.import(path.join(__dirname, './compound_alternate_parents')),
		compoundSynonyms: seq.import(path.join(__dirname, './compound_synonyms')),
		compounds: seq.import(path.join(__dirname, './compounds')),
		compoundsEnzymes: seq.import(path.join(__dirname, './compounds_enzymes')),
		compoundsFlavors: seq.import(path.join(__dirname, './compounds_flavors')),
		compoundsHealthEffects: seq.import(path.join(__dirname, './compounds_health_effects')),
		compoundsPathways: seq.import(path.join(__dirname, './compounds_pathways')),
		contents: seq.import(path.join(__dirname, './contents')),
		flavors: seq.import(path.join(__dirname, './flavors')),
		foodTaxonomies: seq.import(path.join(__dirname, './food_taxonomies')),
		foodcomexCompoundProviders: seq.import(path.join(__dirname, './foodcomex_compound_providers')),
		enzymes: seq.import(path.join(__dirname, './enzymes')),
		foods: seq.import(path.join(__dirname, './foods')),
		healthEffects: seq.import(path.join(__dirname, './health_effects')),
		foodcomexCompounds: seq.import(path.join(__dirname, './foodcomex_compounds')),
		nutrients: seq.import(path.join(__dirname, './nutrients')),
		pathways: seq.import(path.join(__dirname, './pathways')),
		references: seq.import(path.join(__dirname, './references')),
	}
};
