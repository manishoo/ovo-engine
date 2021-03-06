/*
 * food_taxonomies.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { foodTaxonomiesAttribute, foodTaxonomiesInstance } from '@Types/food-database'
import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<foodTaxonomiesInstance, foodTaxonomiesAttribute>('foodTaxonomies', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    foodId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'food_id'
    },
    ncbiTaxonomyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'ncbi_taxonomy_id'
    },
    classificationName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'classification_name'
    },
    classificationOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'classification_order'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    tableName: 'food_taxonomies'
  })
}
