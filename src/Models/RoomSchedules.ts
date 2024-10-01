import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User";
import { MeetingRooms } from "./MeetingRooms";

export const RoomsSchedules = sequelize.define(
    "RoomsSchedules",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        inTime: {
            type: DataTypes.DATE,
            allowNull: false, // Esto hace que el campo sea requerido
            validate: {
                notEmpty: true, // Esto asegura que el campo no esté vacío
            },
        },
        outTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        reservedby: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        meetingRoom: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        timestamps: false,
    }
);

RoomsSchedules.belongsTo(MeetingRooms, {
    foreignKey: "meetingRoom",
    targetKey: "id",
  });