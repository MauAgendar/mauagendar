import amqp from "amqplib";
const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";

export const publishEvent = async (queue: string, event: any) => {
    try {
        const connection = await amqp.connect(amqpUrl); // Configurar a URL correta do RabbitMQ
        const channel = await connection.createChannel();
        
        await channel.assertQueue(queue);
        const message = JSON.stringify(event);

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(message);
        console.log("Event published");

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error publishing event:", error);
    }
};
