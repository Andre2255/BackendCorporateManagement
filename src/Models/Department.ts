import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User";

export const Department = sequelize.define(
  "department",
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

Department.hasMany(User, {
    foreignKey: "department_id",
    sourceKey: "id",
  });
  User.belongsTo(Department, { foreignKey: "department_id", targetKey: "id" });