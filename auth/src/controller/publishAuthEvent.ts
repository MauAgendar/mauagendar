import amqp from "amqplib";
const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";

export const publishAuthenticationEvent = async (token: string) => {
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        const queue = "auth_queue";

        await channel.assertQueue(queue);
        const message = JSON.stringify({ token }); // Updated payload to include the token
        console.log(message);

        channel.sendToQueue(queue, Buffer.from(message));
        console.log("Authentication event published");

        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("Error publishing authentication event", err);
    }
};
