import React, { useEffect, useState } from "react";
import "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventInput } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

interface Appointment {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    description: string;
}

interface CalendarProps {
    userId: number;
}

const Calendar: React.FC<CalendarProps> = ({ userId }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        // Fetch user's appointments when the component mounts
        fetchAppointments(userId);
    }, [userId]);

    const fetchAppointments = async (userId: number) => {
        try {
            const response = await fetch(
                `http://localhost:${
                    import.meta.env.VITE_CALENDAR_PORT
                }/user/${userId}/appointments`
            );
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const formatAppointmentsForCalendar = (): EventInput[] => {
        return appointments.map((appointment) => ({
            title: appointment.title,
            start: appointment.start_time,
            end: appointment.end_time,
            description: appointment.description,
        }));
    };

    const handleEventClick = (info: any) => {
        const event = info.event;
        console.log(event);
        if (event.extendedProps.description) {
            alert(
                "Título: " +
                    event.title +
                    "\nDescrição: " +
                    event.extendedProps.description +
                    "\nData de início: " +
                    event.start +
                    "\nData de término: " +
                    event.end
            );
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h2 className="text-3xl font-semibold text-center text-purple-500">
                Meus Compromissos
            </h2>
            <div className="w-2/3 mt-10">
                <div className="w-full h-full bg-purple-900 rounded-lg shadow-md">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]} // Include interactionPlugin
                        initialView="dayGridMonth"
                        events={formatAppointmentsForCalendar()}
                        eventClick={handleEventClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
