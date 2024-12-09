import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../components/AppointmentList.css'


const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    PacienteID: '',
    MedicoID: '',
    DiaID: '',
    HorarioID: '',
    Estado: '',
  });


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/view-appointment');
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error al obtener las citas');
      setLoading(false);
    }
  };

  // Edición
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment.CitaID);
    setFormData({
      PacienteID: appointment.PacienteID,
      MedicoID: appointment.MedicoID,
      DiaID: appointment.DiaID,
      HorarioID: appointment.HorarioID,
      Estado: appointment.Estado,
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/update-appointment/${editingAppointment}`, formData);
      alert('Cita actualizada correctamente');
      setEditingAppointment(null);
      fetchAppointments(); 
    } catch (err) {
      console.error('Error al actualizar cita:', err);
      alert('Error al actualizar la cita');
    }
  };

  // Eliminación
  const handleDelete = async (CitaID) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await api.delete(`/delete-appointment/${CitaID}`);
        alert('Cita eliminada correctamente');
        fetchAppointments();
      } catch (err) {
        console.error('Error al eliminar cita:', err);
        alert('Error al eliminar la cita');
      }
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="show-appointment-container">
      <h1>Historial de Citas</h1>
      <table className="show-appointment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Día</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.CitaID}>
              <td>{appointment.CitaID}</td>
              <td>{appointment.NombrePaciente}</td>
              <td>{appointment.NombreMedico}</td>
              <td>{appointment.Dia}</td>
              <td>{appointment.Horario}</td>
              <td>{appointment.Estado}</td>
              <td>
                <button
                  type='button'
                  className="btn btn-danger"
                  onClick={() => handleDelete(appointment.CitaID)}
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingAppointment && (
        <div className="edit-form">
          <h2>Editar Cita</h2>
          <form>
            <div>
              <label>Paciente ID:</label>
              <input
                type="text"
                name="PacienteID"
                value={formData.PacienteID}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Médico ID:</label>
              <input
                type="text"
                name="MedicoID"
                value={formData.MedicoID}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Día ID:</label>
              <input
                type="text"
                name="DiaID"
                value={formData.DiaID}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Horario ID:</label>
              <input
                type="text"
                name="HorarioID"
                value={formData.HorarioID}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Estado:</label>
              <input
                type="text"
                name="Estado"
                value={formData.Estado}
                onChange={handleFormChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingAppointment(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
