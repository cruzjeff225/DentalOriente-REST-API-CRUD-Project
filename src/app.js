import express from 'express'
import sistemaRoutes from './routes/sistema.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(sistemaRoutes)
//Cors
app.use(cors())

export default app