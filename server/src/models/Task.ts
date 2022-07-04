import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Task = sequelize.define(
  "task",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING
    },
    singleDate: {
      type: DataType.BOOLEAN
    },
    fromDate: {
      type: DataType.INTEGER
    },
    toDate: {
      type: DataType.INTEGER
    },
    description: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
