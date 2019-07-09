/*
 * LANGUAL.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {langualInstance, langualAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<langualInstance, langualAttribute>('langual', {
    ndbNo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'NDB_No'
    },
    factor: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: 'Factor'
    }
  }, {
    tableName: 'LANGUAL'
  });
};
