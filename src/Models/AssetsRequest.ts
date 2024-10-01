import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


export const AssetsRequest = sequelize.define(
  "assets_request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    managerName: {
      type: DataTypes.STRING,
      allowNull: false, // Esto hace que el campo sea requerido
      validate: {
        notEmpty: true, // Esto asegura que el campo no esté vacío
      },
    },
    collaboratorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    managerArea: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    outputType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    workArea: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    reasonForLeaving: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    devices: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        min: {
          args: [1],
          msg: "El campo devices debe tener al menos un elemento"
        }
      }
    },
    devicePhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        min: {
          args: [1],
          msg: "El campo devicePhotos debe tener al menos un elemento"
        }
      }
    },
    create_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dateOfLeaving: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    return_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    document: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

  },
  {
    timestamps: false,
  }
);

