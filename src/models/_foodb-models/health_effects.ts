/*
 * health_effects.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { healthEffectsAttribute, healthEffectsInstance } from './db'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<healthEffectsInstance, healthEffectsAttribute>('healthEffects', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    chebiName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chebi_name'
    },
    chebiId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chebi_id'
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
    chebiDefinition: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'chebi_definition'
    }
  }, {
    tableName: 'health_effects'
  })
}
