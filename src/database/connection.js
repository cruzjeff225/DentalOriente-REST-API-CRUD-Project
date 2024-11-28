import sql from 'mssql'
import { USER, PASSWORD, SERVER, DATABASE, ENCRYPT, TRUSTCERT } from '../config.js'

// Definiendo los parametros para conectarse a la BD
const dbSettings = {
    user: USER,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE,
    options: {
        encrypt: ENCRYPT === 'true',
        trustServerCertificate: TRUSTCERT === 'true',
    }
}

export const getConnection = async () => {
    try {
        // Creando conexion con la BD especificada en dbSettings
        const pool = await sql.connect(dbSettings)
        return pool
    } catch (error) {
        console.log(error);
    }
}