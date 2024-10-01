import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


export const News = sequelize.define(
    "news",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false, // Esto hace que el campo sea requerido
            validate: {
                notEmpty: true, // Esto asegura que el campo no esté vacío
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false, 
            validate: {
                notEmpty: true, 
            },
        },
        readMore: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,

        },
        data: {
            type: DataTypes.ARRAY(DataTypes.STRING),

        },
        video: {
            type: DataTypes.STRING,

        },
        create_by: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                notEmpty: true, 
            },
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

