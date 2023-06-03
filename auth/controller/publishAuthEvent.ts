import amqp from "amqplib";
const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";

export const publishAuthenticationEvent = async (
    email: String,
    user_id: Number
) => {
    try {
        const connection = await amqp.connect(amqpUrl); // Configurar a URL correta do RabbitMQ
        const channel = await connection.createChannel();
        const queue = "authentication_queue"; // Nome da fila de eventos de autenticação

        await channel.assertQueue(queue);
        const message = JSON.stringify({ email, user_id }); // Dados relevantes do evento
        console.log(message);

        channel.sendToQueue(queue, Buffer.from(message));
        console.log("Authentication event published");

        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("Error publishing authentication event", err);
    }
};
