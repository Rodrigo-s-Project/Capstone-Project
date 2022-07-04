import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Company = sequelize.define(
  "company",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING
    },
    companyPictureURL: {
      type: DataType.STRING
    },
    accessCode: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
