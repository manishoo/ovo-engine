/*
 * NUTR_DEF.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { nutrDefAttribute, nutrDefInstance } from './db'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<nutrDefInstance, nutrDefAttribute>('nutrDef', {
		nutrNo: {
			type: DataTypes.STRING(6),
			allowNull: false,
			field: 'Nutr_no',
			primaryKey: true,
		},
		units: {
			type: DataTypes.STRING(14),
			allowNull: true,
			field: 'Units'
		},
		tagname: {
			type: DataTypes.STRING(40),
			allowNull: true,
			field: 'Tagname'
		},
		nutrDesc: {
			type: DataTypes.STRING(120),
			allowNull: true,
			field: 'NutrDesc'
		},
		numDec: {
			type: DataTypes.STRING(2),
			allowNull: true,
			field: 'Num_Dec'
		},
		srOrder: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'SR_Order'
		}
	}, {
		tableName: 'NUTR_DEF',
		timestamps: false,
	})
}
