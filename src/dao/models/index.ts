/*
 * index.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import {main} from '@dao/connections/sequelize'
import {getModels} from '@dao/models/foods/db.tables'
import {RecipeModel} from './recipe.model'
import {HouseholdModel} from './household.model'
import {OperatorModel} from './operator.model'

export const models = getModels(main)

const {
	CompoundSubstituent,
	CompoundExternalDescriptor,
	CompoundAlternateParent,
	CompoundSynonym,
	Compound,
	CompoundsEnzyme,
	CompoundsFlavor,
	CompoundsHealthEffect,
	CompoundsPathway,
	Content,
	Flavor,
	FoodTaxonomy,
	FoodcomexCompoundProvider,
	Enzyme,
	Food,
	// FoodTr,
	FoodGroup,
	// FoodGroupTr,
	Weight,
	// WeightTr,
	Translation,
	HealthEffect,
	FoodcomexCompound,
	Nutrient,
	Pathway,
	Reference,
	FoodVariety,
} = models

Food.belongsTo(FoodGroup, {
	foreignKey: 'foodGroupId',
	targetKey: 'id',
	as: 'foodGroup',
})
FoodGroup.hasMany(Food, {
	foreignKey: 'foodGroupId',
	sourceKey: 'id',
	as: 'foods',
})
FoodGroup.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
// Translation.belongsTo(FoodGroup, {
// 	foreignKey: 'food_group_id',
// 	targetKey: 'id',
// 	as: 'foodGroup',
// })
Food.hasMany(Content, {
	foreignKey: 'foodId',
	sourceKey: 'id',
	as: 'contents',
})
Food.hasMany(FoodTaxonomy, {
	foreignKey: 'foodId',
	sourceKey: 'id',
	as: 'taxonomies',
})
// Content.belongsTo(Nutrient, {
// 	foreignKey: 'id',
// 	targetKey: 'source_id',
// 	as: 'nutrient',
// })
// Content.belongsTo(Food, {
// 	foreignKey: 'id',
// 	targetKey: 'source_id',
// 	as: 'compound',
// })
Food.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Translation.belongsTo(Food, {
	foreignKey: 'sourceId',
	targetKey: 'id',
	as: 'food',
})
Translation.belongsTo(FoodVariety, {
	foreignKey: 'sourceId',
	targetKey: 'id',
	as: 'foodVariety',
})
FoodVariety.belongsTo(Food, {
	foreignKey: 'foodId',
	targetKey: 'id',
	as: 'food',
})
FoodVariety.hasMany(Weight, {
	foreignKey: 'foodVarietyId',
	sourceKey: 'id',
	as: 'weights',
})
FoodVariety.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
Weight.belongsTo(FoodVariety, {
	foreignKey: 'foodVarietyId',
	targetKey: 'id',
})
Weight.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'id',
	as: 'translations',
})
// Food.hasMany(Weight, {
// 	foreignKey: 'foodId',
// 	sourceKey: 'id',
// 	as: 'weights',
// })
Content.hasMany(Translation, {
	foreignKey: 'sourceId',
	sourceKey: 'origFoodId',
	as: 'translations',
})
// FoodVariety.hasMany(Translation, {
// 	foreignKey: 'sourceId',
// 	sourceKey: 'origFoodId',
// 	as: 'translations',
// })




























// FoodGroup.hasMany(Food, {
// 	foreignKey: 'fgid',
// 	sourceKey: 'fgid',
// 	as: 'foodGroup'
// 	// TODO onDelete
// 	// TODO onUpdate
// })
// FoodGroup.hasMany(FoodGroupTr, {
// 	foreignKey: 'fgid',
// 	sourceKey: 'fgid',
// 	as: 'translations',
// })
// FoodGroupTr.belongsTo(FoodGroup, {
// 	foreignKey: 'fgid',
// 	targetKey: 'fgid',
// 	as: 'translation',
// 	// TODO onDelete
// 	// TODO onUpdate
// })
// Food.belongsTo(FoodGroup, {
// 	foreignKey: 'fgid',
// 	targetKey: 'fgid',
// 	as: 'foodGroup'
// })
// Food.hasMany(NutrientData, {
// 	foreignKey: 'fid',
// 	sourceKey: 'fid',
// 	as: 'nutrients',
// 	// TODO onDelete
// 	// TODO onUpdate
// })
// Food.hasMany(FoodTr, {
// 	foreignKey: 'fid',
// 	as: 'translations',
// 	// TODO onDelete
// 	// TODO onUpdate
// })
// Food.hasMany(Weight, {
// 	foreignKey: 'fid',
// 	sourceKey: 'fid',
// 	as: 'weights'
// })
// FoodTr.belongsTo(Food, {
// 	foreignKey: 'fid',
// 	targetKey: 'fid',
// 	// as: 'translation',
// 	// TODO onDelete
// 	// TODO onUpdate
// })
// Weight.belongsTo(Food, {
// 	foreignKey: 'fid',
// 	targetKey: 'fid',
// })
// Weight.hasMany(WeightTr, {
// 	foreignKey: 'wid',
// 	sourceKey: 'wid',
// 	as: 'translations',
// })
// NutrientData.belongsTo(Nutrient, {
// 	foreignKey: 'nid',
// 	// sourceKey: 'nid',
// 	as: 'nutrient'
// 	// TODO onDelete
// 	// TODO onUpdate
// })
//
// export {
// 	foods as Food,
// 	foodsTr as FoodTr,
// 	foodGroup as FoodGroup,
// 	foodGroupTr as FoodGroupTr,
// 	NutrientData,
// 	Nutrient,
// 	Weight,
// 	WeightTr,
// 	HouseholdModel,
// 	OperatorModel,
// 	RecipeModel,
// 	// NutrientTr,
// }

export {
	CompoundSubstituent,
	CompoundExternalDescriptor,
	CompoundAlternateParent,
	CompoundSynonym,
	Compound,
	CompoundsEnzyme,
	CompoundsFlavor,
	CompoundsHealthEffect,
	CompoundsPathway,
	Content,
	Flavor,
	FoodTaxonomy,
	FoodcomexCompoundProvider,
	Enzyme,
	Food,
	// FoodTr,
	FoodGroup,
	Translation,
	// FoodGroupTr,
	Weight,
	// WeightTr,
	HealthEffect,
	FoodcomexCompound,
	Nutrient,
	Pathway,
	Reference,
	FoodVariety,
}
