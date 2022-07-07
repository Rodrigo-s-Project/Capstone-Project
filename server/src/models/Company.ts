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
    accessCodeEmployee: {
      type: DataType.STRING
    },
    accessCodeClient: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
