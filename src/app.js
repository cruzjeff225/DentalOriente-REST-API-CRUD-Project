import express from 'express'
import sistemaRoutes from './routes/sistema.routes.js'
import cors from 'cors'


const app = express()
//Cors
app.use(cors())
app.use(express.json())
app.use(sistemaRoutes)

export default app