/*
 * WEIGHT.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { weightAttribute, weightInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<weightInstance, weightAttribute>('weight', {
    ndbNo: {
      type: DataTypes.STRING(510),
      allowNull: true,
      field: 'NDB_No',
    },
    seq: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'Seq'
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Amount'
    },
    msreDesc: {
      type: DataTypes.STRING(510),
      allowNull: true,
      field: 'Msre_Desc'
    },
    gmWgt: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Gm_Wgt'
    },
    numDataPts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'Num_Data_pts'
    },
    stdDev: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Std_Dev'
    }
  }, {
    tableName: 'WEIGHT',
    timestamps: false,
  })
}
