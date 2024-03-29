import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataType.STRING
    },
    password: {
      type: DataType.STRING
    },
    globalUsername: {
      type: DataType.STRING
    },
    status: {
      type: DataType.STRING,
      defaultValue: "available"
    },
    profilePictureURL: {
      type: DataType.STRING
    },
    isDarkModeOn: {
      type: DataType.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: false
  }
);
