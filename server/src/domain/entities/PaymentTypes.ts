import dotenv from "dotenv";
dotenv.config();

export const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY
export const PAYU_SALT = process.env.PAYU_SALT


// DEV:
// export const RABBITMQ_URL  = "amqp://rabbitmq:5672"
