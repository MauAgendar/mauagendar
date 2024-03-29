import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            if (userId === 0) {
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
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                return response.data;
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
            const token = sessionStorage.getItem("token");

            const response = await axios.post(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments`,
                newAppointment,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments([...appointments, response.data]);
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
            const token = sessionStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments/${id}`,
                newAppointment,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;
            const updatedAppointments = appointments.map(
                (appointment: Appointment) =>
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
            navigate("/login");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = await axios.get(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments`,

                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setAppointments(response.data);
            } else {
                setAppointments([]);
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
