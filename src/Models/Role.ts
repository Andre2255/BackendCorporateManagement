import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User";

export const Role = sequelize.define(
  "role",
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
    isManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isManagerSGI: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isSGI: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    timestamps: false,
  }
);

Role.hasMany(User, {
  foreignKey: "role_id",
  sourceKey: "id",
});
User.belongsTo(Role, { foreignKey: "role_id", targetKey: "id" });