import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Message = sequelize.define(
  "message",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataType.STRING
    },
    mediaURL: {
      type: DataType.STRING
    }
  },
  {
    timestamps: true
  }
);
