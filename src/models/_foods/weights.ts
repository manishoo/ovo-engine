/*
 * weights.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import * as sequelize from 'sequelize'
import { DataTypes } from 'sequelize'
import { weightAttribute, weightInstance } from 'src/types/food-database'


module.exports = function (sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<weightInstance, weightAttribute>('weights', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    publicId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'public_id',
    },
    foodVarietyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'food_variety_id'
    },
    origDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'orig_desc'
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gmWgt: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'gm_wgt',
    },
    seq: DataTypes.SMALLINT,
    unit: DataTypes.STRING(10),
    numDataPts: { type: DataTypes.INTEGER(11), field: 'num_data_pts' },
    stdDev: { type: DataTypes.FLOAT, field: 'std_dev' },
  }, {
    timestamps: false,
  })
}
