import amqp from "amqplib";

const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";
let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export const consumeEvent = async (
    queue: string,
    callback: (event: any) => void
) => {
    try {
        if (!connection) {
            connection = await amqp.connect(amqpUrl);
        }

        if (!channel) {
            channel = await connection.createChannel();
            process.on("SIGINT", async () => {
                await channel?.close();
                await connection?.close();
                process.exit(0);
            });
        }

        await channel.assertQueue(queue);
        await channel.consume(queue, (message: any) => {
            if (message) {
                const event = JSON.parse(message.content.toString());
                callback(event);
                channel?.ack(message);
            }
        });

        console.log(`Consuming events from ${queue}`);
    } catch (error) {
        console.error("Error consuming events:", error);
    }
};

export const publishEvent = async (queue: string, event: any) => {
    try {
        if (!connection) {
            connection = await amqp.connect(amqpUrl);
        }

        if (!channel) {
            channel = await connection.createChannel();
        }

        await channel.assertQueue(queue);
        const message = JSON.stringify(event);

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(message);
        console.log("Event published");
    } catch (error) {
        console.error("Error publishing event:", error);
    }
};
