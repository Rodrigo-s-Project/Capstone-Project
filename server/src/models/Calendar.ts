import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Calendar = sequelize.define(
  "calendar",
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
