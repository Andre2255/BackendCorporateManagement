import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Token = sequelize.define(
    "token",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false, // Esto hace que el campo sea requerido
        validate: {
          notEmpty: true, // Esto asegura que el campo no esté vacío
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      expiresAt: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    },
    {
      timestamps: false,
    }
  );
  

