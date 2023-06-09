import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/Auth";
interface Appointment {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
}

interface CompromissosProps {
    userId: number;
}

const Compromissos: React.FC<CompromissosProps> = ({ userId }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [newAppointment, setNewAppointment] = useState<Appointment>({
        id: 0,
        title: "",
        description: "",
        start_time: "",
        end_time: "",
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            if (userId === 0) {
                // User not authenticated, handle accordingly
                // For example, redirect to login page
                return;
            }

            try {
                const data = await getAppointments(userId);
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [userId]);

    const getAppointments = async (userId: number) => {
        if (userId === 0) {
            // User not authenticated or unauthorized, handle accordingly
            return [];
        }

        try {
            const response = await fetch(
                `http://localhost:${import.meta.env.VITE_CALENDAR_PORT}/user/${userId}/appointments`
            );
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return [];
        }
    };

    const createAppointment = async (userId: number) => {
        if (userId === 0) {
            // User not authenticated or unauthorized, handle accordingly
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:${import.meta.env.VITE_CALENDAR_PORT}/user/${userId}/appointments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAppointment),
                }
            );
            const data = await response.json();
            setAppointments([...appointments, data]);
            setNewAppointment({
                id: 0,
                title: "",
                description: "",
                start_time: "",
                end_time: "",
            });
        } catch (error) {
            console.error("Error creating appointment:", error);
        }
    };

    const updateAppointment = async (userId: number, id: number) => {
        if (userId === 0) {
            // User not authenticated or unauthorized, handle accordingly
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:${import.meta.env.VITE_CALENDAR_PORT}/user/${userId}/appointments/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAppointment),
                }
            );
            const data = await response.json();
            const updatedAppointments = appointments.map((appointment) =>
                appointment.id === id ? data : appointment
            );
            setAppointments(updatedAppointments);
            setNewAppointment({
                id: 0,
                title: "",
                description: "",
                start_time: "",
                end_time: "",
            });
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    const deleteAppointment = async (userId: number, id: number) => {
        if (userId === 0) {
            // User not authenticated or unauthorized, handle accordingly
            return;
        }

        try {
            await fetch(
                `http://localhost:${import.meta.env.VITE_CALENDAR_PORT}/user/${userId}/appointments/${id}`,
                {
                    method: "DELETE",
                }
            );

            const response = await fetch(
                `http://localhost:${import.meta.env.VITE_CALENDAR_PORT}/user/${userId}/appointments`
            );
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                setAppointments([]); // Reset appointments to an empty array if no appointments are returned
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-gray-900">
            <h1 className="text-3xl font-bold text-purple-500 mb-4">
                Compromissos
            </h1>

            <div className="grid grid-cols-1 gap-4 mb-4">
                {appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="p-4 border border-purple-300 rounded"
                    >
                        <h3 className="text-xl font-bold text-purple-500 mb-2">
                            {appointment.title}
                        </h3>
                        <p className="mb-2">{appointment.description}</p>
                        <p className="text-gray-600">
                            Tempo de Início: {appointment.start_time}
                        </p>
                        <p className="text-gray-600">
                            Prazo: {appointment.end_time}
                        </p>
                        <button
                            onClick={() =>
                                deleteAppointment(userId, appointment.id)
                            }
                            className="text-red-500 hover:text-red-700"
                        >
                            Deletar
                        </button>
                        <button
                            onClick={() => setNewAppointment(appointment)}
                            className="text-blue-500 hover:text-blue-700 ml-2"
                        >
                            Editar
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Criar Compromisso</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (newAppointment.id === 0) {
                        createAppointment(userId);
                    } else {
                        updateAppointment(userId, newAppointment.id);
                    }
                }}
            >
                <label className="block mb-2 text-purple-500">
                    Título:
                    <input
                        type="text"
                        value={newAppointment.title}
                        onChange={(e) =>
                            setNewAppointment({
                                ...newAppointment,
                                title: e.target.value,
                            })
                        }
                        required
                        className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </label>
                <label className="block mb-2 text-purple-500">
                    Descrição:
                    <input
                        type="text"
                        value={newAppointment.description}
                        onChange={(e) =>
                            setNewAppointment({
                                ...newAppointment,
                                description: e.target.value,
                            })
                        }
                        required
                        className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </label>
                <label className="block mb-2 text-purple-500">
                    Tempo de Início:
                    <input
                        type="datetime-local"
                        value={newAppointment.start_time}
                        onChange={(e) =>
                            setNewAppointment({
                                ...newAppointment,
                                start_time: e.target.value,
                            })
                        }
                        required
                        className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </label>
                <label className="block mb-2 text-purple-500">
                    Prazo:
                    <input
                        type="datetime-local"
                        value={newAppointment.end_time}
                        onChange={(e) =>
                            setNewAppointment({
                                ...newAppointment,
                                end_time: e.target.value,
                            })
                        }
                        required
                        className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </label>
                <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded"
                >
                    {newAppointment.id === 0 ? "Criar" : "Atualizar"}
                </button>
            </form>
        </div>
    );
};

export default Compromissos;
