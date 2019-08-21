/*
 * FOOTNOTE.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { footnoteAttribute, footnoteInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<footnoteInstance, footnoteAttribute>('footnote', {
    ndbNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'NDB_No'
    },
    footntNo: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'Footnt_No'
    },
    footntTyp: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'Footnt_Typ'
    },
    nutrNo: {
      type: DataTypes.STRING(6),
      allowNull: true,
      field: 'Nutr_No'
    },
    footntTxt: {
      type: DataTypes.STRING(400),
      allowNull: true,
      field: 'Footnt_Txt'
    }
  }, {
    tableName: 'FOOTNOTE'
  })
}
