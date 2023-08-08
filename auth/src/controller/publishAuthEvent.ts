import amqp from "amqplib";

const amqpUrl = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672/";

const retryOptions = {
    retries: 5, // Number of retries
    delay: 1000, // Initial delay in milliseconds
    factor: 2, // Delay factor for exponential backoff
};

const retry: any = async (fn: () => Promise<any>, options: any) => {
    try {
        return await fn();
    } catch (error) {
        if (options.retries <= 0) {
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, options.delay));
        options.retries--;
        options.delay *= options.factor;

        return retry(fn, options);
    }
};

export const publishAuthenticationEvent = async (token: string) => {
    try {
        await retry(async () => {
            const connection = await amqp.connect(amqpUrl);
            const channel = await connection.createChannel();
            const queue = "auth_queue";

            await channel.assertQueue(queue);
            const message = JSON.stringify({ token });
            console.log(message);

            channel.sendToQueue(queue, Buffer.from(message));
            console.log("Authentication event published");

            await channel.close();
            await connection.close();
        }, retryOptions);
    } catch (err) {
        console.error("Error publishing authentication event", err);
    }
};
