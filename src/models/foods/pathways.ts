/*
 * pathways.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */


import { pathwaysAttribute, pathwaysInstance } from '@Types/food-database'
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<pathwaysInstance, pathwaysAttribute>('pathways', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'id'
		},
		smpdbId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'smpdb_id'
		},
		keggMapId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'kegg_map_id'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'name'
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
		}
	}, {
		tableName: 'pathways'
	})
}
