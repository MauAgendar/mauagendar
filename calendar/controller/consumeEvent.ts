import amqp from "amqplib";
const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";

export const consumeEvent = async (
    queue: string,
    callback: (event: any) => void
) => {
    try {
        const connection = await amqp.connect(amqpUrl); // Configurar a URL correta do RabbitMQ
        const channel = await connection.createChannel();

        await channel.assertQueue(queue);
        await channel.consume(queue, (message) => {
            if (message) {
                const event = JSON.parse(message.content.toString());
                callback(event);
                channel.ack(message);
            }
        });

        console.log(`Consuming events from ${queue}`);

        process.on("SIGINT", async () => {
            await channel.close();
            await connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error("Error consuming events:", error);
    }
};
