import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataType.STRING
    },
    nameUser: {
      type: DataType.STRING
    },
    emailUser: {
      type: DataType.STRING
    },
    phoneNumberUser: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
