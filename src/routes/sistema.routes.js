import { Router } from "express";
import {systemControllers} from '../controllers/sistemaContollers.js'

const router = Router()

//ENDPOINT raíz
router.get('/', (req, res) => {
    res.send("Bienvenido al Sistema de Gestión de Citas - DentalOriente")
})

//ENDPOINT para registrarse como usuario
router.post('/register', systemControllers.createUser)

//ENDPOITN para iniciar sesión
router.post('/login', systemControllers.login)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
//ENDPOINT para registrar paciente
router.post('/patient-profile', systemControllers.registerPatient)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
//ENDPOINT para crear citas medicas
router.post('/createAppointment', systemControllers.createAppointment)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
//ENDPOINT para mostrar todos los medicos
router.get('/all-medics', systemControllers.allMedics)

//ENDPOINT para mostrar todos los horarios
router.get('/all-hours', systemControllers.allSchedules)
router.get('/available-days', systemControllers.getAvailableDays)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
//ENDPOINT para mostrar todos los pacientes
router.get('/all-patient', systemControllers.allPatient)

//ENDPOINT para mostrar paciente por ID
router.get('/patient/:patientID', systemControllers.patientID)

//ENDPOINT para mostrar todas las citas creadas en la clinica
router.get('/view-appointment', systemControllers.viewAppointment)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
//ENDPOINT para actualizar paciente por ID
router.put('/update-patient/:patientID', systemControllers.updatePatient)

//ENDPOINT para actualizar citas por ID
router.put('/appoinment/:idAppointment', systemControllers.updateAppointment)

// CONSUMIENDOLO EN EL FRONTEND-----------------------------
router.delete('/delete-patient/:PacienteID', systemControllers.deletePatient)
router.delete('/delete-appointment/:CitaID', systemControllers.deleteAppointment)


export default router



