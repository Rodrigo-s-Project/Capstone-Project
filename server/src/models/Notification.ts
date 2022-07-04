import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Notification = sequelize.define(
  "notification",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    timestamps: false
  }
);
