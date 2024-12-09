import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import PatientList from '../components/PatientList';
import MedicList from '../components/MedicList';
import PatientForm from '../components/PatientForm'
import AppointmentList from '../components/AppointmentList'
import '../pages/Dashboard.css'

const Dashboard = () => {
    return (
        <Router>
            <div className="container-fluid vh-100">
                <div className="row h-100">
                    {/* Menú lateral */}
                    <aside className="col-md-3 bg-dark text-white d-flex flex-column p-3">
                        <h2 className="text-center mb-4">DentalOriente</h2>
                        <nav>
                            <ul className="nav flex-column">
                            <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/">
                                        Inicio
                                    </Link>
                                </li>
                            <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/patient">
                                        Crear Paciente
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/create-appointment">
                                        Crear Cita
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/patients">
                                        Lista de Pacientes
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/appointment">
                                        Historial de Citas
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/medics">
                                        Médicos Disponibles
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Contenido principal */}
                    <main className="col-md-9 bg-light p-4">
                        <Routes>
                        <Route path="/patient" element={<PatientForm />} />
                            <Route path="/create-appointment" element={<AppointmentForm />} />
                            <Route path="/patients" element={<PatientList />} />
                            <Route path="/medics" element={<MedicList />} />
                            <Route path="/appointment" element={<AppointmentList/>} />
                            <Route path="/" element={<div className='title'><h1 className="text-center">Bienvenido a tu Gestión de Citas</h1></div>} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default Dashboard;
