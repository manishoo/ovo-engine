/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {compoundsInstance, compoundsAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<compoundsInstance, compoundsAttribute>('compounds', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    legacyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'legacy_id'
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'type'
    },
    publicId: {
      type: DataTypes.STRING(9),
      allowNull: false,
      unique: true,
      field: 'public_id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'name'
    },
    export: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0',
      field: 'export'
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'state'
    },
    annotationQuality: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'annotation_quality'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    casNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cas_number'
    },
    meltingPoint: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'melting_point'
    },
    proteinFormula: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'protein_formula'
    },
    proteinWeight: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'protein_weight'
    },
    experimentalSolubility: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_solubility'
    },
    experimentalLogp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_logp'
    },
    hydrophobicity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'hydrophobicity'
    },
    isoelectricPoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'isoelectric_point'
    },
    metabolism: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'metabolism'
    },
    keggCompoundId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'kegg_compound_id'
    },
    pubchemCompoundId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'pubchem_compound_id'
    },
    pubchemSubstanceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'pubchem_substance_id'
    },
    chebiId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chebi_id'
    },
    hetId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'het_id'
    },
    uniprotId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'uniprot_id'
    },
    uniprotName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'uniprot_name'
    },
    genbankId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'genbank_id'
    },
    wikipediaId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'wikipedia_id'
    },
    synthesisCitations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'synthesis_citations'
    },
    generalCitations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'general_citations'
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comments'
    },
    proteinStructureFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'protein_structure_file_name'
    },
    proteinStructureContentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'protein_structure_content_type'
    },
    proteinStructureFileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'protein_structure_file_size'
    },
    proteinStructureUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'protein_structure_updated_at'
    },
    msdsFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'msds_file_name'
    },
    msdsContentType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'msds_content_type'
    },
    msdsFileSize: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'msds_file_size'
    },
    msdsUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'msds_updated_at'
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
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    phenolexplorerId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'phenolexplorer_id'
    },
    dfcId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'dfc_id'
    },
    hmdbId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'hmdb_id'
    },
    dukeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'duke_id'
    },
    drugbankId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'drugbank_id'
    },
    biggId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'bigg_id'
    },
    eafusId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'eafus_id'
    },
    knapsackId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'knapsack_id'
    },
    boilingPoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'boiling_point'
    },
    boilingPointReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'boiling_point_reference'
    },
    charge: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'charge'
    },
    chargeReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'charge_reference'
    },
    density: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'density'
    },
    densityReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'density_reference'
    },
    opticalRotation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'optical_rotation'
    },
    opticalRotationReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'optical_rotation_reference'
    },
    percentComposition: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'percent_composition'
    },
    percentCompositionReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'percent_composition_reference'
    },
    physicalDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'physical_description'
    },
    physicalDescriptionReference: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'physical_description_reference'
    },
    refractiveIndex: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'refractive_index'
    },
    refractiveIndexReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'refractive_index_reference'
    },
    uvIndex: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'uv_index'
    },
    uvIndexReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'uv_index_reference'
    },
    experimentalPka: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_pka'
    },
    experimentalPkaReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_pka_reference'
    },
    experimentalSolubilityReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_solubility_reference'
    },
    experimentalLogpReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'experimental_logp_reference'
    },
    hydrophobicityReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'hydrophobicity_reference'
    },
    isoelectricPointReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'isoelectric_point_reference'
    },
    meltingPointReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'melting_point_reference'
    },
    moldbAlogpsLogp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_alogps_logp'
    },
    moldbLogp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_logp'
    },
    moldbAlogpsLogs: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_alogps_logs'
    },
    moldbSmiles: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'moldb_smiles'
    },
    moldbPka: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_pka'
    },
    moldbFormula: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_formula'
    },
    moldbAverageMass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_average_mass'
    },
    moldbInchi: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'moldb_inchi'
    },
    moldbMonoMass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_mono_mass'
    },
    moldbInchikey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_inchikey'
    },
    moldbAlogpsSolubility: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'moldb_alogps_solubility'
    },
    moldbId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'moldb_id'
    },
    moldbIupac: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'moldb_iupac'
    },
    structureSource: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'structure_source'
    },
    duplicateId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'duplicate_id'
    },
    oldDfcId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'old_dfc_id'
    },
    dfcName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'dfc_name'
    },
    compoundSource: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'compound_source'
    },
    flavornetId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'flavornet_id'
    },
    goodscentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'goodscent_id'
    },
    superscentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'superscent_id'
    },
    phenolexplorerMetaboliteId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'phenolexplorer_metabolite_id'
    },
    kingdom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'kingdom'
    },
    superklass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'superklass'
    },
    klass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'klass'
    },
    subklass: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'subklass'
    },
    directParent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'direct_parent'
    },
    molecularFramework: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'molecular_framework'
    },
    chemblId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chembl_id'
    },
    chemspiderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'chemspider_id'
    },
    metaCycId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'meta_cyc_id'
    },
    foodcomex: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      field: 'foodcomex'
    },
    phytohubId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'phytohub_id'
    }
  }, {
    tableName: 'compounds'
  });
};
