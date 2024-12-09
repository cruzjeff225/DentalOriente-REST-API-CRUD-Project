import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../components/PatientList.css';

const PatientList = () => {
    const [patients, setPatients] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [editingPatient, setEditingPatient] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Obtener los datos desde el backend
        const fetchPatients = async () => {
            try {
                const response = await api.get('/all-patient');
                setPatients(response.data); 
                setLoading(false); 
            } catch (err) {
                console.error('Error al obtener los pacientes:', err);
                setError('No se pudieron obtener los pacientes');
                setLoading(false);
            }
        };

        fetchPatients();
    }, []); 

    const handleEditClick = (patient) => {
        setEditingPatient(patient);
        setFormData({
            Nombre: patient.Nombre,
            Apellido: patient.Apellido,
            FechaNacimiento: patient.FechaNacimiento.split('T')[0],
            Telefono: patient.Telefono,
            Direccion: patient.Direccion,
        });
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
            try {
                await api.delete(`/delete-patient/${id}`);
                setPatients(patients.filter((patient) => patient.PacienteID !== id));
                alert('Paciente eliminado correctamente.');
            } catch (err) {
                console.error('Error al eliminar el paciente:', err);
                alert('No se pudo eliminar el paciente. Tienes citas pendientes');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/update-patient/${editingPatient.PacienteID}`, formData);
            setPatients((prevPatients) =>
                prevPatients.map((patient) =>
                    patient.PacienteID === editingPatient.PacienteID
                        ? { ...patient, ...formData }
                        : patient
                )
            );
            setEditingPatient(null);
            alert('Paciente actualizado correctamente.');
        } catch (err) {
            console.error('Error al actualizar el paciente:', err);
            alert('No se pudo actualizar el paciente.');
        }
    };

    const handleCancelEdit = () => {
        setEditingPatient(null); 
    };

    if (loading) return <p>Cargando pacientes...</p>; 
    if (error) return <p>{error}</p>; 

    return (
        <div class='show-patient-container'>
            <h1>Lista de Pacientes</h1>
            {!editingPatient ? (
                <table className='show-patient-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Telefono</th>
                            <th>Direccion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.PacienteID}>
                                <td>{patient.PacienteID}</td>
                                <td>{patient.Nombre}</td>
                                <td>{patient.Apellido}</td>
                                <td>{patient.FechaNacimiento}</td>
                                <td>{patient.Telefono}</td>
                                <td>{patient.Direccion}</td>
                                <td>
                                    <button
                                        type='button'
                                        className="btn btn-warning"
                                        onClick={() => handleEditClick(patient)}
                                    >
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        type='button'
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteClick(patient.PacienteID)}
                                    >
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="edit-form-container">
                    <div className='edit-appointment-form'>
                    <h2><i class="bi bi-pencil-square"></i></h2>
                    <form onSubmit={handleEditSave}>
                        <div>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="Nombre"
                                value={formData.Nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Apellido:</label>
                            <input
                                type="text"
                                name="Apellido"
                                value={formData.Apellido}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                name="FechaNacimiento"
                                value={formData.FechaNacimiento}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Teléfono:</label>
                            <input
                                type="text"
                                name="Telefono"
                                value={formData.Telefono}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Dirección:</label>
                            <input
                                type="text"
                                name="Direccion"
                                value={formData.Direccion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <button type="submit" className='btn btn-success'>Guardar</button>
                            <button type="button" className='btn btn-secondary'onClick={handleCancelEdit}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default PatientList;
