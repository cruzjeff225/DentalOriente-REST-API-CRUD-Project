import { getConnection } from '../database/connection.js'
import sql from 'mssql'
import bcrypt, { getRounds } from 'bcrypt'

export const systemControllers = {

    // CREAR USUARIO
    async createUser(req, res) {
        try {
            const hashedPass = await bcrypt.hash(req.body.Password, 10)
            const pool = await getConnection()
            const result = await pool.request()
                .input('NombreUsuario', sql.NVarChar, req.body.NombreUsuario)
                .input('Email', sql.NVarChar, req.body.Email)
                .input('Password', sql.NVarChar, hashedPass)
                .query('INSERT INTO Usuarios (NombreUsuario, Email, Password) VALUES (@NombreUsuario, @Email, @Password)')
            res.json({
                message: `${req.body.NombreUsuario} te has registrado con éxito! Ahora, inicia sesión.`
            });
        } catch (error) {
            res.send({
                status: false,
                message: error.message
            })
        }
    },

    // INICIAR SESIÓN
    async login(req, res) {
        try {
            const { NombreUsuario, Password } = req.body
            const pool = await getConnection()
            const result = await pool.request()
                .input('NombreUsuario', sql.NVarChar, NombreUsuario)
                .query('SELECT UsuarioID, NombreUsuario, Password FROM Usuarios WHERE NombreUsuario = @NombreUsuario')

            if (result.recordset.length === 0) {
                return res.status(400).json({ message: 'Usuario no encontrado' })
            }
            const user = result.recordset[0]
            const isMatch = await bcrypt.compare(Password, user.Password)

            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' })
            }

            res.json({ message: 'Inicio de sesión exitoso' })

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return res.status(500).json({ message: 'Error interno del servidor. Inténtalo de nuevo más tarde.' });
        }
    },

    // REGISTRAR PACIENTES
    async registerPatient(req, res) {
        try {
            const { Nombre, Apellido, FechaNacimiento, Telefono, Direccion } = req.body
            if (!Nombre || !Apellido || !FechaNacimiento || !Telefono || !Direccion){
                return res.status(400).json({message: 'Todos los campos son obligatorios'})
            }
            const pool = await getConnection()

            const result = await pool.request()
                .input('Nombre', sql.NVarChar, Nombre)
                .input('Apellido', sql.NVarChar, Apellido)
                .input('FechaNacimiento', sql.Date, FechaNacimiento)
                .input('Telefono', sql.NVarChar, Telefono)
                .input('Direccion', sql.NVarChar, Direccion)
                .query('INSERT INTO Pacientes (Nombre, Apellido, FechaNacimiento, Telefono, Direccion) OUTPUT INSERTED.PacienteID VALUES (@Nombre, @Apellido, @FechaNacimiento, @Telefono, @Direccion)')

            const nuevoPacienteID = result.recordset[0].PacienteID

            res.status(201).json({
                message: 'Paciente registrado exitosamente',
                PacienteID: nuevoPacienteID
            })

        } catch (error) {
            console.log('Error al registrar paciente')
            res.status(500).json({ message: 'Error al registrar paciente' })
        }
    },

    // MOSTRAR TODOS LOS MEDICOS DISPONIBLES
    async allMedics(req, res) {
        try {
            const { EspecialidadID, Nombre } = req.body
            const pool = await getConnection()
            const result = await pool.request()
            .query('SELECT M.MedicoID, M.Nombre, M.Apellido, M.Telefono, M.Email, E.Nombre AS Especialidad FROM Medicos M INNER JOIN Especialidades E ON M.EspecialidadID = E.EspecialidadID')

            if (result.recordset.length === 0) {
                return res.status(400).json({ message: 'No hay medicos disponibles' })
            }

            res.status(200).json(result.recordset)
        } catch (error) {
            console.error('Error al obtener los médicos:', error)
            res.status(500).json({ message: 'Hubo un error al obtener los médicos' })
        }
    },


    // MOSTRAR TODOS LOS PACIENTES 
    async allPatient(req, res) {
        try {
            const {Nombre, Apellido, FechaNacimiento, Telefono, Direccion} = req.body
            const pool = await getConnection()
            const result = await pool.request()
            .query('SELECT * FROM Pacientes')

            if(result.recordset.length === 0) {
                return res.status(500).json({message: 'No hay pacientes disponibles'})
            }

            res.status(200).json(result.recordset)
        } catch (error) {
            console.log("Error al obtener pacientes", error)
            res.status(500).json({message: 'Hubo un error al obtener los pacientes', error})
        }
    },

    // MOSTRAR PACIENTE POR ID
    async patientID(req, res) {
        try {
            const {patientID} = req.params

            if (!patientID || isNaN(patientID)) {
                return res.status(400).json({ mensaje: 'El pacienteID debe ser un número válido.' })
              }

            const pool = await getConnection()
            const result = await pool.request()
            .input('pacienteID', sql.Int, patientID)
            .query('SELECT * FROM Pacientes WHERE PacienteID = @pacienteID')
            

            if (result.recordset.length === 0) {
                return res.status(404).json({ mensaje: 'Paciente no encontrado.' })
              }

            res.status(200).json(result.recordset[0])
            
        } catch (error) {
            console.error('Error al obtener el paciente:', error)
            res.status(500).json({ mensaje: 'Error al obtener los datos del paciente.' })
        }
    },

    // ACTUALIZAR PACIENTE POR ID
    async updatePatient(req, res) {
        try {
            const {patientID} = req.params
            const {Nombre, Apellido, FechaNacimiento, Telefono, Direccion} = req.body

            const pool = await getConnection()
            const result = await pool.request()
            .input('PacienteID', sql.Int, patientID)
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Apellido', sql.NVarChar, Apellido)
            .input('FechaNacimiento', sql.Date, FechaNacimiento)
            .input('Telefono', sql.NVarChar, Telefono)
            .input('Direccion', sql.NVarChar, Direccion)
            .query('UPDATE Pacientes SET Nombre = @Nombre, Apellido = @Apellido, FechaNacimiento = @FechaNacimiento, Telefono = @Telefono, Direccion = @Direccion WHERE PacienteID = @PacienteID')


            if (result.rowsAffected[0] > 0) {
                res.status(200).json({message: 'Paciente actualizado exitosamente'})
            } else {
                res.status(404).json({message: 'Paciente no encontrado'})
            }

        } catch (error) {
            console.log('Error al actualizar paciente');
            res.status(500).json({message: 'Error al actualizar paciente'})
            
        }
    },
    // CREAR CITAS MEDICAS
    async createAppointment(req, res) {
        try {
            const {PacienteID, MedicoID, DiaID, HorarioID, Fecha, Estado} = req.body
            const pool = await getConnection()
            const result = await pool.request()
            .input('PacienteID', sql.Int, PacienteID)
            .input('MedicoID', sql.Int, MedicoID)
            .input('DiaID', sql.Int, DiaID)
            .input('HorarioID', sql.Int, HorarioID)
            .input('Fecha', sql.Date, Fecha)
            .input('Estado', sql.NVarChar, Estado)
            //Ejecutando un Procedimiento Almacenado SQL
            .execute('CrearCita');

            res.status(200).json({
                message: 'Cita creada exitosamente',
                data: result
            })
        } catch (err) {
            if (err.number === 50001) {
                res.status(400).json({ error: err.message }); // Error de validación
            } else {
                console.error(err);
                res.status(500).json({ error: 'Error al crear la cita.' });
            }
        }
    },

    async allSchedules(req, res) {
        try {
            const { MedicoID, DiaID } = req.query;
            const pool = await getConnection();
            const result = await pool.request()
            .input('MedicoID', sql.Int, MedicoID)
            .input('DiaID', sql.Int, DiaID)
            .query(`
                SELECT H.HorarioID, H.MedicoID, H.DiaID, D.Nombre AS Dia, 
                       FORMAT(H.HoraInicio, 'hh\\:mm') AS HoraInicio, 
                       FORMAT(H.HoraFin, 'hh\\:mm') AS HoraFin
                FROM Horarios H
                INNER JOIN Dias D ON H.DiaID = D.DiaID
                WHERE H.MedicoID = @MedicoID AND H.DiaID = @DiaID
            `);
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'No hay horarios disponibles para este médico y día' });
            }
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
            res.status(500).json({ message: 'Error al obtener los horarios.' });
        }
    },
    //
    async getAvailableDays(req, res) {
        try {
            const { MedicoID } = req.query;
    
            const pool = await getConnection();
            const result = await pool.request()
                .input('MedicoID', sql.Int, MedicoID)
                .query(`
                    SELECT DISTINCT D.DiaID, D.Nombre 
                    FROM Horarios H
                    INNER JOIN Dias D ON H.DiaID = D.DiaID
                    WHERE H.MedicoID = @MedicoID
                `);
    
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'No hay días disponibles para este médico' });
            }
    
            res.status(200).json(result.recordset); // Devuelve los días disponibles
        } catch (error) {
            console.error('Error al obtener los días disponibles:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los días disponibles' });
        }
    },

    // MOSTRAR TODAS LAS CITAS
    async viewAppointment(req, res){
        try {
            const pool = await getConnection()
            const result = await pool.request()
            .query(`
                SELECT 
                    C.CitaID,
                    CONCAT(P.Nombre, ' ', P.Apellido) AS NombrePaciente,
                    CONCAT(M.Nombre, ' ', M.Apellido) AS NombreMedico,
                    D.Nombre AS Dia,
                    CONCAT(H.HoraInicio, ' - ', H.HoraFin) AS Horario,
                    C.Estado
                FROM 
                    Citas C
                JOIN Pacientes P ON C.PacienteID = P.PacienteID
                JOIN Medicos M ON C.MedicoID = M.MedicoID
                JOIN Dias D ON C.DiaID = D.DiaID
                JOIN Horarios H ON C.HorarioID = H.HorarioID;
            `)
            res.status(200).json(result.recordset)
        } catch (error) {
            console.error(error);
        res.status(500).json({ error: 'Error al obtener las citas' })
        }
    },

    // ACTUALIZAR CITAS POR ID
    async updateAppointment(req, res) {
        try {
            const {idAppointment} = req.params
            const {PacienteID, MedicoID, DiaID, HorarioID, Estado} = req.body
            const pool = await getConnection()
            const result = await pool.request()
            .input('CitaID', sql.Int, idAppointment)
            .input('PacienteID', sql.Int, PacienteID)
            .input('MedicoID', sql.Int, MedicoID)
            .input('DiaID', sql.Int, DiaID)
            .input('HorarioID', sql.Int, HorarioID)
            .input('Estado', sql.NVarChar, Estado)
            .query('UPDATE Citas SET PacienteID = @PacienteID, MedicoID = @MedicoID, DiaID = @DiaID, HorarioID = @HorarioID, Estado = @Estado WHERE  CitaID = @CitaID')


            if (result.rowsAffected[0] > 0) {
                res.status(200).json({ message: 'Cita actualizada correctamente' })
            } else {
                res.status(404).json({ error: 'Cita no encontrada' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la cita' });
        }
    },

    async deleteAppointment(req,res) {
        try {
            const {CitaID} = req.params
            const pool = await getConnection()
            const result = await pool.request()
            .input('CitaID', sql.Int, CitaID)
            .query('DELETE FROM Citas WHERE CitaID = @CitaID')

            if (result.rowsAffected[0] > 0) {
                res.json({ message: 'Cita eliminada exitosamente.' });
            } else {
                res.status(404).json({ message: 'Cita no encontrado.' });
            }

        } catch (error) {
            console.log('Error al eliminar cita: ', error)
            res.status(500).json({message: 'Error al eliminar cita'})
        }
    },

    async deletePatient(req,res) {
        try {
            const {PacienteID} = req.params
            const pool = await getConnection()
            const result = await pool.request()
            .input('PacienteID', sql.Int, PacienteID)
            .query('DELETE FROM Pacientes WHERE PacienteID = @PacienteID')

            if (result.rowsAffected[0] > 0) {
                res.json({ message: 'Paciente eliminado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Paciente no encontrado.' });
            }

        } catch (error) {
            console.log('Error al eliminar paciente: ', error)
            res.status(500).json({message: 'Error al eliminar paciente'})
        }
    }

}
