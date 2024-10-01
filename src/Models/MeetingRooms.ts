import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { RoomsSchedules } from "./RoomSchedules";

export const MeetingRooms = sequelize.define(
  "MeetingRooms",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Esto hace que el campo sea requerido
      validate: {
          notEmpty: true, // Esto asegura que el campo no esté vacío
      },
      unique: true
    },
  },
  {
    timestamps: false,
  }
);
