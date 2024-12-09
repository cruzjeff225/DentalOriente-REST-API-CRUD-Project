import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../components/AppointmentForm.css'

const AppointmentForm = () => {
    const [medics, setMedics] = useState([]);
    const [days, setDays] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [formData, setFormData] = useState({
        PacienteID: '',
        MedicoID: '',
        DiaID: '',
        HorarioID: '',
        Fecha: '',
        Estado: 'Pendiente',
    });


    useEffect(() => {
        const fetchMedics = async () => {
            try {
                const medicsResponse = await api.get('/all-medics');
                console.log('Médicos cargados:', medicsResponse.data);
                setMedics(medicsResponse.data);
            } catch (error) {
                console.error('Error al cargar médicos:', error);
            }
        };

        fetchMedics();
    }, []);

    // Cargar días dinámicamente cuando se selecciona un médico
    useEffect(() => {
        if (formData.MedicoID) {
            console.log('Consultando días disponibles para el médico:', formData.MedicoID);
            const fetchDays = async () => {
                try {
                    const response = await api.get('/available-days', {
                        params: { MedicoID: formData.MedicoID },
                    });
                    console.log('Días disponibles cargados:', response.data);
                    setDays(response.data);
                } catch (error) {
                    console.error('Error al cargar días disponibles:', error);
                    setDays([]); // Resetea los días si hay un error
                }
            };

            fetchDays();
        } else {
            setDays([])
        }
    }, [formData.MedicoID])

    // Cargar horarios dinámicamente cuando se seleccionan médico y día
    useEffect(() => {
        if (formData.MedicoID && formData.DiaID) {
            console.log('Consultando horarios para:', formData.MedicoID, formData.DiaID);
            const fetchSchedules = async () => {
                try {
                    const response = await api.get('/all-hours', {
                        params: { MedicoID: formData.MedicoID, DiaID: formData.DiaID },
                    });
                    console.log('Horarios cargados:', response.data);
                    setSchedules(response.data);
                } catch (error) {
                    console.error('Error al cargar horarios:', error);
                }
            };

            fetchSchedules();
        } else {
            setSchedules([])
        }
    }, [formData.MedicoID, formData.DiaID]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Cambiando valor de ${name} a ${value}`);

        // Actualizar el estado de formData
        setFormData(prevState => {
            const newFormData = { ...prevState, [name]: value };


            if (name === 'MedicoID') {
                newFormData.DiaID = ''; 
                newFormData.HorarioID = ''; 
            } else if (name === 'DiaID') {
                newFormData.HorarioID = ''; 
            }

            return newFormData;
        });
    };

    // Enviar datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', formData);
        try {
            const response = await api.post('/createAppointment', formData);
            alert(response.data.message);
        } catch (error) {
            console.error('Error al crear cita:', error);
            alert('Error al crear la cita.');
        }
    };

    return (
        <div className='create-appoinment-container'>
            <div className='create-appoinment-form'>
            <h2><i class="bi bi-pencil-square"></i></h2>
            <form onSubmit={handleSubmit}>
                <label>Paciente ID:</label>
                <input
                    type="text"
                    name="PacienteID"
                    value={formData.PacienteID}
                    onChange={handleInputChange}
                    required
                />

                <label>Médico:</label>
                <select
                    name="MedicoID"
                    value={formData.MedicoID}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Seleccionar médico</option>
                    {medics.map((medic) => (
                        <option key={medic.MedicoID} value={medic.MedicoID}>
                            {`${medic.Nombre} ${medic.Apellido}`}
                        </option>
                    ))}
                </select>

                <label>Día:</label>
                <select
                    name="DiaID"
                    value={formData.DiaID}
                    onChange={handleInputChange}
                    required
                    disabled={days.length === 0}
                >
                    <option value="">Seleccionar día</option>
                    {days.map((day) => (
                        <option key={day.DiaID} value={day.DiaID}>
                            {day.Nombre}
                        </option>
                    ))}
                </select>

                <label>Horario:</label>
                <select
                    name="HorarioID"
                    value={formData.HorarioID}
                    onChange={handleInputChange}
                    required
                    disabled={schedules.length === 0}
                >
                    <option value="">Seleccionar horario</option>
                    {schedules.map((schedule) => (
                        <option key={schedule.HorarioID} value={schedule.HorarioID}>
                            {`${schedule.HoraInicio} - ${schedule.HoraFin}`}
                        </option>
                    ))}
                </select>

                <label>Fecha:</label>
                <input
                    type="date"
                    name="Fecha"
                    value={formData.Fecha}
                    onChange={handleInputChange}
                    required
                />

                <label>Estado:</label>
                <select
                    name="Estado"
                    value={formData.Estado}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>

                <button className= "create-appoinment-button"type="submit">Crear Cita</button>
            </form>
            </div>
        </div>
    );
};

export default AppointmentForm;
