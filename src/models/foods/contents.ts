/*
 * contents.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */


import { contentsAttribute, contentsInstance } from '@Types/food-database'
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<contentsInstance, contentsAttribute>('contents', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'id'
		},
		sourceId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'source_id'
		},
		sourceType: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'source_type'
		},
		foodId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'food_id'
		},
		origFoodId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_food_id'
		},
		origFoodCommonName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_food_common_name'
		},
		origFoodScientificName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_food_scientific_name'
		},
		origFoodPart: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_food_part'
		},
		origSourceId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_source_id'
		},
		origSourceName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_source_name'
		},
		origContent: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			field: 'orig_content'
		},
		origMin: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			field: 'orig_min'
		},
		origMax: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			field: 'orig_max'
		},
		origUnit: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_unit'
		},
		origCitation: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'orig_citation'
		},
		citation: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'citation'
		},
		citationType: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'citation_type'
		},
		creatorId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'creator_id'
		},
		updaterId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'updater_id'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'updated_at'
		},
		origMethod: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_method'
		},
		origUnitExpression: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'orig_unit_expression'
		},
		standardContent: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			field: 'standard_content'
		}
	}, {
		tableName: 'contents'
	})
}
