import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

export const Team = sequelize.define(
  "team",
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING
    },
    teamPictureURL: {
      type: DataType.STRING
    },
    emailUser: {
      type: DataType.STRING
    },
    phoneNumberUser: {
      type: DataType.STRING
    },
    accessCode: {
      type: DataType.STRING
    }
  },
  {
    timestamps: false
  }
);
