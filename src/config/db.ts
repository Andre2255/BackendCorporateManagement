import { Sequelize } from "sequelize"
import dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // db name,
  process.env.DATABASE_USERNAME, // username
  process.env.DATABASE_PASS, // password
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port:+process.env.DATABASE_PORT,
    schema: "main",
    dialectOptions: {
      useUTC: false, // Para que Sequelize no convierta las fechas a UTC
    },
    timezone: '+00:00', // Zona horaria de Costa Rica
    // pool: {
    //   max: 5,
    //   min: 0,
    //   require: 30000,
    //   idle: 10000,
    // },
    // logging: false,
  }
)
