/*
 * db.d.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

// tslint:disable
import * as Sequelize from 'sequelize';


// table: dataSrc
export interface dataSrcAttribute {
  dataSrcId:string;
  authors?:string;
  title?:string;
  year?:string;
  journal?:string;
  volCity?:string;
  issueState?:string;
  startPage?:string;
  endPage?:string;
}
export interface dataSrcInstance extends Sequelize.Instance<dataSrcAttribute>, dataSrcAttribute { }
export interface dataSrcModel extends Sequelize.Model<dataSrcInstance, dataSrcAttribute> { }

// table: derivCd
export interface derivCdAttribute {
  derivCd:string;
  derivDesc?:string;
}
export interface derivCdInstance extends Sequelize.Instance<derivCdAttribute>, derivCdAttribute { }
export interface derivCdModel extends Sequelize.Model<derivCdInstance, derivCdAttribute> { }

// table: fdGroup
export interface fdGroupAttribute {
  fdGrpCd:string;
  fdGrpDesc:string;
}
export interface fdGroupInstance extends Sequelize.Instance<fdGroupAttribute>, fdGroupAttribute { }
export interface fdGroupModel extends Sequelize.Model<fdGroupInstance, fdGroupAttribute> { }

// table: datsrcln
export interface datsrclnAttribute {
  ndbNo:string;
  nutrNo:string;
  dataSrcId:string;
}
export interface datsrclnInstance extends Sequelize.Instance<datsrclnAttribute>, datsrclnAttribute { }
export interface datsrclnModel extends Sequelize.Model<datsrclnInstance, datsrclnAttribute> { }

// table: foodDes
export interface foodDesAttribute {
  ndbNo:string;
  fdGrpCd?:string;
  longDesc:string;
  shrtDesc:string;
  comName?:string;
  manufacName?:string;
  survey?:string;
  refDesc?:string;
  refuse?:number;
  sciName?:string;
  nFActor?:number;
  proFactor?:number;
  fatFactor?:number;
  choFactor?:number;
}
export interface foodDesInstance extends Sequelize.Instance<foodDesAttribute>, foodDesAttribute { }
export interface foodDesModel extends Sequelize.Model<foodDesInstance, foodDesAttribute> { }

// table: langdesc
export interface langdescAttribute {
  factor:string;
  description?:string;
}
export interface langdescInstance extends Sequelize.Instance<langdescAttribute>, langdescAttribute { }
export interface langdescModel extends Sequelize.Model<langdescInstance, langdescAttribute> { }

// table: langual
export interface langualAttribute {
  ndbNo:string;
  factor:string;
}
export interface langualInstance extends Sequelize.Instance<langualAttribute>, langualAttribute { }
export interface langualModel extends Sequelize.Model<langualInstance, langualAttribute> { }

// table: footnote
export interface footnoteAttribute {
  ndbNo?:string;
  footntNo?:string;
  footntTyp?:string;
  nutrNo?:string;
  footntTxt?:string;
}
export interface footnoteInstance extends Sequelize.Instance<footnoteAttribute>, footnoteAttribute { }
export interface footnoteModel extends Sequelize.Model<footnoteInstance, footnoteAttribute> { }

// table: nutData
export interface nutDataAttribute {
  ndbNo:string;
  nutrNo:string;
  nutrVal:number;
  numDataPts?:number;
  stdError?:number;
  srcCd?:string;
  derivCd?:string;
  refNdbNo?:string;
  addNutrMark?:string;
  numStudies?:number;
  min?:number;
  max?:number;
  df?:number;
  lowEb?:number;
  upEb?:number;
  statCmt?:string;
  addModDate?:string;
}
export interface nutDataInstance extends Sequelize.Instance<nutDataAttribute>, nutDataAttribute { }
export interface nutDataModel extends Sequelize.Model<nutDataInstance, nutDataAttribute> { }

// table: nutrDef
export interface nutrDefAttribute {
  nutrNo:string;
  units?:string;
  tagname?:string;
  nutrDesc:string;
  numDec:string;
  srOrder?:number;
}
export interface nutrDefInstance extends Sequelize.Instance<nutrDefAttribute>, nutrDefAttribute { }
export interface nutrDefModel extends Sequelize.Model<nutrDefInstance, nutrDefAttribute> { }

// table: srcCd
export interface srcCdAttribute {
  srcCd:string;
  srcCdDesc?:string;
}
export interface srcCdInstance extends Sequelize.Instance<srcCdAttribute>, srcCdAttribute { }
export interface srcCdModel extends Sequelize.Model<srcCdInstance, srcCdAttribute> { }

// table: weight
export interface weightAttribute {
  ndbNo:string;
  seq?:string;
  amount:number;
  msreDesc:string;
  gmWgt:number;
  numDataPts?:number;
  stdDev?:number;
}
export interface weightInstance extends Sequelize.Instance<weightAttribute>, weightAttribute { }
export interface weightModel extends Sequelize.Model<weightInstance, weightAttribute> { }
