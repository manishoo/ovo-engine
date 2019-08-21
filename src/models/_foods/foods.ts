/*
 * foods.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { foodsAttribute, foodsInstance } from '@Types/food-database'
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<foodsInstance, foodsAttribute>('foods', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    publicId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'slug'
    },
    origName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'orig_name'
    },
    nameScientific: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'name_scientific'
    },
    itisId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'itis_id'
    },
    wikipediaId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'wikipedia_id'
    },
    pictureFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'picture_file_name'
    },
    pictureContentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'picture_content_type'
    },
    pictureFileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'picture_file_size'
    },
    pictureUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'picture_updated_at'
    },
    legacyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'legacy_id'
    },
    foodGroupId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'food_group_id',
    },
    foodType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'food_type'
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
    exportToAfcdb: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      field: 'export_to_afcdb'
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'category'
    },
    ncbiTaxonomyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'ncbi_taxonomy_id'
    },
    exportToFoodb: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1',
      field: 'export_to_foodb'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
  }, {
    tableName: 'foods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
  })
}
