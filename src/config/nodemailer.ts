import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    pool: true, // Enable connection pooling
    maxConnections: 5, // Adjust the pool size according to your needs
    maxMessages: 10 // Adjust the maximum number of messages per connection
  }
}

export const transporter = nodemailer.createTransport(config());
