/*
 * translations.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { translationAttribute, translationInstance } from 'src/types/food-database'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<translationInstance, translationAttribute>('translations', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    field: DataTypes.STRING(50),
    sourceId: {
      type: DataTypes.STRING(40),
      allowNull: false,
      // field: 'source_id'
    },
    sourceType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      // field: 'source_type'
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    }
  }, {
    timestamps: true,
    // updatedAt: 'updated_at',
    // createdAt: 'created_at',
  })
}
