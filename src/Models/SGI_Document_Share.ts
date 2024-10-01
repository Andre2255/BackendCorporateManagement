import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


export const SGI_Document_Share = sequelize.define(
    "SGI_Document_Share",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        document_name: {
            type: DataTypes.STRING,
            allowNull: false, // Esto hace que el campo sea requerido
            validate: {
                notEmpty: true, // Esto asegura que el campo no esté vacío
            },
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                notEmpty: true, 
            },
        },
        updateBy: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                notEmpty: true, 
            },
        },
        isFolder: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          },
        date: {
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

