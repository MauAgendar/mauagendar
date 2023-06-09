import express, { Request, Response } from "express";
// Configuração do client de conexões com o PostgreSQL
import client from "../configs/database";
client.connect();
import { publishEvent } from "./publishEvent";

// appointments (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     start_time TIMESTAMP NOT NULL,
//     end_time TIMESTAMP NOT NULL,
//     user_id INT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

class Appointment {
    getAppointment = async (req: Request, res: Response) => {
        const { userId } = req.params;

        try {
            // Consulta SQL para buscar os compromissos do usuário no banco de dados
            const query = "SELECT * FROM appointments WHERE user_id = $1";
            const values = [userId];
            const result = await client.query(query, values);

            const appointments = result.rows;
            await publishEvent("appointment_events", {
                appointments,
                action: "read",
            });
            res.json(appointments);
        } catch (error) {
            console.error("Erro ao buscar compromissos:", error);
            res.status(500).json({ message: "Erro ao buscar compromissos." });
        }
    };

    makeAppointments = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { title, description, start_time, end_time } = req.body;
        try {
            // Verifica se todos os campos foram informados
            if (!title || !description || !start_time || !end_time) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios." });
            }

            // Consulta SQL para criar um novo compromisso no banco de dados
            const query = `INSERT INTO appointments (user_id, title, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [userId, title, description, start_time, end_time];
            const result = await client.query(query, values);

            const newAppointment = result.rows[0];
            await publishEvent("appointment_events", {
                newAppointment,
                action: "create",
            });
            res.status(201).json(newAppointment);
        } catch (error) {
            console.error("Erro ao criar compromisso:", error);
            res.status(500).json({ message: "Erro ao criar compromisso." });
        }
    };

    updateUserAppointment = async (req: Request, res: Response) => {
        const { userId, appointmentId } = req.params;
        const { title, description, start_time, end_time } = req.body;
        try {
            // Verifica se todos os campos foram informados
            if (!title || !description || !start_time || !end_time) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios." });
            }

            // Consulta SQL para atualizar o compromisso no banco de dados
            const query = `UPDATE appointments SET title = $1, description = $2, start_time = $3, end_time = $4 WHERE id = $5 AND user_id = $6 RETURNING *`;
            const values = [
                title,
                description,
                start_time,
                end_time,
                appointmentId,
                userId,
            ];
            const result = await client.query(query, values);

            if (result.rowCount === 0) {
                return res
                    .status(404)
                    .json({ message: "Compromisso não encontrado." });
            }

            const updatedAppointment = result.rows[0];
            await publishEvent("appointment_events", {
                updatedAppointment,
                action: "update",
            });
            res.json(updatedAppointment);
        } catch (error) {
            console.error("Erro ao atualizar compromisso:", error);
            res.status(500).json({ message: "Erro ao atualizar compromisso." });
        }
    };

    deleteAppointment = async (req: Request, res: Response) => {
        const { userId, appointmentId } = req.params;

        try {
            // Consulta SQL para excluir o compromisso do banco de dados
            const query =
                "DELETE FROM appointments WHERE id = $1 AND user_id = $2";
            const values = [appointmentId, userId];
            const result = await client.query(query, values);

            if (result.rowCount === 0) {
                return res
                    .status(404)
                    .json({ message: "Compromisso não encontrado." });
            }
            await publishEvent("appointment_events", {
                userId,
                appointmentId,
                action: "delete",
            });
            res.status(204).send();
        } catch (error) {
            console.error("Erro ao excluir compromisso:", error);
            res.status(500).json({ message: "Erro ao excluir compromisso." });
        }
    };
}
export default Appointment;
