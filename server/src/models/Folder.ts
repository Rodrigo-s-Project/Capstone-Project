import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Folder = sequelize.define(
  "folder",
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
    hasParent: {
      type: DataType.BOOLEAN
    }
  },
  {
    timestamps: true
  }
);
