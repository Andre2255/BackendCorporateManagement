import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


export const SGI_RequestNewItem = sequelize.define(
    "SGI_RequestNewItem",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false, 
            validate: {
                notEmpty: true, 
            },
        },
        requestBy: {
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
        status: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                notEmpty: true, 
                isIn: [[1, 2, 3]], // only allow values 1, 2, or 3
            },
            defaultValue: 1
        },

    },
    {
        timestamps: false,
    }
);

