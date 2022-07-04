import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Bucket = sequelize.define(
  "bucket",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
