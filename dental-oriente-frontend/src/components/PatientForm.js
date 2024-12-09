import React, {useState} from "react";
import api from "../services/api";
import '../components/PatientForm.css'

const PatientForm = () =>{
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        FechaNacimiento: '',
        Telefono: '',
        Direccion: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/patient-profile', formData)
            alert('Paciente registrado con exito')
        } catch (error) {
            console.log('Error', error);
            alert('Error al registrar paciente')
        }
    };

    return (
        <div className="create-patient-container">
            <div className="create-patient-form">
            <h1><i class="bi bi-person-fill-add"></i></h1>
        <form onSubmit={handleSubmit}>
            <label>
                Nombre:
                <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Apellidos:
                <input
                    type="text"
                    name="Apellido"
                    value={formData.Apellido}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Fecha de Nacimiento:
                <input
                    type="date"
                    name="FechaNacimiento"
                    value={formData.FechaNacimiento}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Telefono:
                <input
                    type="text"
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Direccion:
                <input
                    type="text"
                    name="Direccion"
                    value={formData.Direccion}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <button className="create-patient-button" type="submit">
                Registrar Paciente
            </button>
        </form>
        </div>
    </div>
    )


}

export default PatientForm;