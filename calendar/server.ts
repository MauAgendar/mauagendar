import express, { Request, Response } from 'express';
const app = express();
app.use(express.json());

// Configuração do client de conexões com o PostgreSQL
import client from './configs/database';
client.connect();

// Rota para obter os compromissos de um usuário
app.get('/user/:userId/appointments', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Consulta SQL para buscar os compromissos do usuário no banco de dados
    const query = 'SELECT id, title, date FROM appointments WHERE user_id = $1';
    const values = [userId];
    const result = await client.query(query, values);
    
    const appointments = result.rows;

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar compromissos:', error);
    res.status(500).json({ message: 'Erro ao buscar compromissos.' });
  }
});

// Rota para criar um novo compromisso
app.post('/user/:userId/appointments', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { title, date } = req.body;

  try {
    // Verifica se todos os campos foram informados
    if (!title || !date) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Consulta SQL para criar um novo compromisso no banco de dados
    const query =
      'INSERT INTO appointments (user_id, title, date) VALUES ($1, $2, $3) RETURNING id, title, date';
    const values = [userId, title, date];
    const result = await client.query(query, values);

    const newAppointment = result.rows[0];

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Erro ao criar compromisso:', error);
    res.status(500).json({ message: 'Erro ao criar compromisso.' });
  }
});

// Rota para atualizar um compromisso existente
app.put('/user/:userId/appointments/:appointmentId', async (req: Request, res: Response) => {
  const { userId, appointmentId } = req.params;
  const { title, date } = req.body;

  try {
    // Verifica se todos os campos foram informados
    if (!title || !date) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Consulta SQL para atualizar o compromisso no banco de dados
    const query =
      'UPDATE appointments SET title = $1, date = $2 WHERE id = $3 AND user_id = $4 RETURNING id, title, date';
    const values = [title, date, appointmentId, userId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Compromisso não encontrado.' });
    }

    const updatedAppointment = result.rows[0];

    res.json(updatedAppointment);
    } catch (error) {
    console.error('Erro ao atualizar compromisso:', error);
    res.status(500).json({ message: 'Erro ao atualizar compromisso.' });
    }
});

// Rota para excluir um compromisso existente
app.delete('/user/:userId/appointments/:appointmentId', async (req: Request, res: Response) => {
    const { userId, appointmentId } = req.params;
    
    try {
        // Consulta SQL para excluir o compromisso do banco de dados
        const query = 'DELETE FROM appointments WHERE id = $1 AND user_id = $2';
        const values = [appointmentId, userId];
        const result = await client.query(query, values);
    
        if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Compromisso não encontrado.' });
        }
    
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir compromisso:', error);
        res.status(500).json({ message: 'Erro ao excluir compromisso.' });
    }
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}!`);
    }
);
