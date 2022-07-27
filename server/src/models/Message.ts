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
      type: DataType.STRING(1000)
    },
    mediaURL: {
      type: DataType.STRING
    },
    lat: {
      type: DataType.DOUBLE,
      defaultValue: 0.0
    },
    lng: {
      type: DataType.DOUBLE,
      defaultValue: 0.0
    },
    ownerId: {
      type: DataType.INTEGER
    }
  },
  {
    timestamps: true
  }
);
