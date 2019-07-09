/*
 * FOOD_DES.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import {DataTypes} from 'sequelize'
import {foodDesInstance, foodDesAttribute} from './db'

module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
	return sequelize.define<foodDesInstance, foodDesAttribute>('foodDes', {
		ndbNo: {
			type: DataTypes.STRING(10),
			allowNull: false,
			field: 'NDB_No',
			primaryKey: true,
		},
		fdGrpCd: {
			type: DataTypes.STRING(8),
			allowNull: true,
			field: 'FdGrp_Cd',
		},
		longDesc: {
			type: DataTypes.STRING(400),
			allowNull: true,
			field: 'Long_Desc'
		},
		shrtDesc: {
			type: DataTypes.STRING(120),
			allowNull: true,
			field: 'Shrt_Desc'
		},
		comName: {
			type: DataTypes.STRING(510),
			allowNull: true,
			field: 'Com_Name'
		},
		manufacName: {
			type: DataTypes.STRING(130),
			allowNull: true,
			field: 'ManufacName'
		},
		survey: {
			type: DataTypes.STRING(2),
			allowNull: true,
			field: 'Survey'
		},
		refDesc: {
			type: DataTypes.STRING(270),
			allowNull: true,
			field: 'Ref_Desc'
		},
		refuse: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'Refuse'
		},
		sciName: {
			type: DataTypes.STRING(130),
			allowNull: true,
			field: 'Sci_Name'
		},
		nFActor: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'N_FActor'
		},
		proFactor: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'Pro_Factor_'
		},
		fatFactor: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'Fat_Factor_'
		},
		choFactor: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'CHO_Factor'
		}
	}, {
		tableName: 'FOOD_DES',
		timestamps: false
	})
}
