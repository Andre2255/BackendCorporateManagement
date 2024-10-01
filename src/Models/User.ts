import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { News } from "./News";
import { Token } from "./Token";
import { RoomsSchedules } from "./RoomSchedules";
import { SGI_Document_Share } from "./SGI_Document_Share";
import { SGI_Document } from "./SGI_Document";
import { SGI_RequestChange } from "./SGI_RequestChange";
import { SGI_RequestNewItem } from "./SGI_RequestNewItem";
import { AssetsRequest } from "./AssetsRequest";

export const User = sequelize.define(
  "user",
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
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false, 
      validate: {
          notEmpty: true, 
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false, 
      validate: {
          notEmpty: true, 
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
          notEmpty: true, 
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      validate: {
          notEmpty: true, 
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      validate: {
          notEmpty: true, 
      },
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    photo1: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    photo2: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
  },
  {
    timestamps: false,
    
  }
);

User.hasMany(News, {
  foreignKey: "create_by",
  sourceKey: "id",
});

News.belongsTo(User, {
  foreignKey: "create_by",
  targetKey: "id",
});

User.hasMany(Token, {
  foreignKey: "user_id",
  sourceKey: "id",
});
User.hasMany(RoomsSchedules, {
  foreignKey: "reservedBy",
  sourceKey: "id",
})
User.hasMany(SGI_Document_Share, {
  foreignKey: "updateBy",
  sourceKey: "id",
})
User.hasMany(SGI_Document, {
  foreignKey: "updateBy",
  sourceKey: "id",
})
User.hasMany(SGI_RequestChange, {
  foreignKey: "requestBy",
  sourceKey: "id",
})
User.hasMany(SGI_RequestNewItem, {
  foreignKey: "requestBy",
  sourceKey: "id",
})
User.hasMany(AssetsRequest, {
  foreignKey: "create_by",
  sourceKey: "id",
})
Token.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});
