/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {foodcomexCompoundsInstance, foodcomexCompoundsAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<foodcomexCompoundsInstance, foodcomexCompoundsAttribute>('foodcomexCompounds', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    compoundId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'compound_id'
    },
    origin: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'origin'
    },
    storageForm: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'storage_form'
    },
    maximumQuantity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'maximum_quantity'
    },
    storageCondition: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'storage_condition'
    },
    contactName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'contact_name'
    },
    contactAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'contact_address'
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'contact_email'
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
    },
    export: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'export'
    },
    purity: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'purity'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    spectraDetails: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'spectra_details'
    },
    deliveryTime: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'delivery_time'
    },
    stability: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stability'
    },
    adminUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'admin_user_id'
    },
    publicId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'public_id'
    },
    casNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'cas_number'
    },
    taxonomyClass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'taxonomy_class'
    },
    taxonomyFamily: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'taxonomy_family'
    },
    experimentalLogp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'experimental_logp'
    },
    experimentalSolubility: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'experimental_solubility'
    },
    meltingPoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'melting_point'
    },
    foodOfOrigin: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'food_of_origin'
    },
    productionMethodReferenceText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'production_method_reference_text'
    },
    productionMethodReferenceFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'production_method_reference_file_name'
    },
    productionMethodReferenceContentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'production_method_reference_content_type'
    },
    productionMethodReferenceFileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'production_method_reference_file_size'
    },
    productionMethodReferenceUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'production_method_reference_updated_at'
    },
    elementalFormula: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'elemental_formula'
    },
    minimumQuantity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'minimum_quantity'
    },
    quantityUnits: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      field: 'quantity_units'
    },
    availableSpectra: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'available_spectra'
    },
    storageConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'storage_conditions'
    }
  }, {
    tableName: 'foodcomex_compounds'
  });
};
