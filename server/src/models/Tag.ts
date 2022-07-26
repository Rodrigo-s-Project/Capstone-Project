import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Tag = sequelize.define(
  "tag",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    color: {
      type: DataType.STRING
    },
    text: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
