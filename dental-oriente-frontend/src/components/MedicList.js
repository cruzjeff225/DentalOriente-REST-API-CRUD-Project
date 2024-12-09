import React, { useState, useEffect } from 'react'
import api from '../services/api';
import '../components/MedicList.css'

const MedicList = () => {
    const [medics, setMedics] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        // Obteniendo los datos desde el backend
        const fetchMedics = async () => {
            try {
                const response = await api.get('/all-medics')
                setMedics(response.data); 
                setLoading(false); 
            } catch (err) {
                console.error('Error al obtener los medicos:', err)
                setError('No se pudieron obtener los medicos disponibles')
                setLoading(false)
            }
        };

        fetchMedics();
    }, []); 

    if (loading) return <p>Cargando medicos...</p>; 
    if (error) return <p>{error}</p>; 


    return (
        <div className='show-medic-container'>
            <h1>Medicos Disponibles</h1>
            <table className='show-medic-table'>
                <thead>
                    <tr>
                        <th>MedicoID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th>Especialidad</th>
                    </tr>
                </thead>
                <tbody>
                    {medics.map((medic) => (
                        <tr key={medic.MedicoID}>
                            <td>{medic.MedicoID}</td>
                            <td>{medic.Nombre}</td>
                            <td>{medic.Apellido}</td>
                            <td>{medic.Telefono}</td>
                            <td>{medic.Email}</td>
                            <td>{medic.Especialidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default MedicList;
