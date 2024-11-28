import app from './app.js'
import { PORT } from './config.js'
import { getConnection } from './database/connection.js';

// Iniciando servidor
app.listen(PORT)
console.log("Servidor corriendo en el puerto: ", PORT);

getConnection();