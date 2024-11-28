import { config } from "dotenv";

// Cargando variables de entorno
config()

export const PORT = process.env.PORT || 3000
export const USER = process.env.DB_USER
export const PASSWORD = process.env.DB_PASSWORD
export const SERVER = process.env.DB_SERVER
export const DATABASE = process.env.DB_DATABASE
export const ENCRYPT = process.env.DB_ENCRYPT
export const TRUSTCERT = process.env.DB_TRUST_CERT
