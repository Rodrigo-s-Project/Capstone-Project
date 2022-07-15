import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const File = sequelize.define(
  "file",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING
    },
    isProtected: {
      type: DataType.BOOLEAN
    },
    type: {
      type: DataType.STRING
    },
    hasParent: {
      type: DataType.BOOLEAN
    }
  },
  {
    timestamps: true
  }
);
