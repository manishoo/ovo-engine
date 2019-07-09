/*
 * SRC_CD.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {srcCdInstance, srcCdAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<srcCdInstance, srcCdAttribute>('srcCd', {
    srcCd: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'Src_Cd'
    },
    srcCdDesc: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'SrcCd_Desc'
    }
  }, {
    tableName: 'SRC_CD'
  });
};
