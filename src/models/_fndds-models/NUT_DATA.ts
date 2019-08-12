/*
 * NUT_DATA.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { nutDataAttribute, nutDataInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<nutDataInstance, nutDataAttribute>('nutData', {
    ndbNo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'NDB_No'
    },
    nutrNo: {
      type: DataTypes.STRING(6),
      allowNull: false,
      field: 'Nutr_No',
      primaryKey: true,
    },
    nutrVal: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Nutr_Val'
    },
    numDataPts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'Num_Data_Pts'
    },
    stdError: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Std_Error'
    },
    srcCd: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'Src_Cd'
    },
    derivCd: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'Deriv_Cd'
    },
    refNdbNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Ref_NDB_No'
    },
    addNutrMark: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'Add_Nutr_Mark'
    },
    numStudies: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'Num_Studies'
    },
    min: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Min'
    },
    max: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Max'
    },
    df: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'DF'
    },
    lowEb: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Low_EB'
    },
    upEb: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'Up_EB'
    },
    statCmt: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'Stat_Cmt'
    },
    addModDate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'AddMod_Date'
    }
  }, {
    tableName: 'NUT_DATA',
    timestamps: false,
  })
}
