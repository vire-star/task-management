import { configDotenv } from 'dotenv'
configDotenv({quiet:true})
export const ENV={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    PUBLIC_KEY:process.env.PUBLIC_KEY,
    PRIVATE_KEY:process.env.PRIVATE_KEY,
    URL_ENDPOINT:process.env.URL_ENDPOINT,
    BREVO_SMTP_KEY:process.env.BREVO_SMTP_KEY,
    BREVO_EMAIL:process.env.BREVO_EMAIL,
    CLIENT_URL:process.env.CLIENT_URL,
    BREVO_API_KEY:process.env.BREVO_API_KEY
}