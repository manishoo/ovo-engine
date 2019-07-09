/*
 * pathways.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {pathwaysInstance, pathwaysAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
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
  });
};
