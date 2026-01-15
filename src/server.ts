import connectMongo from './app/config/database';
import config from './app/config';
import { app } from './app';

async function main(): Promise<void> {
    try {
        await connectMongo(config.db_string as string);
        const PORT = config.port;
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    } catch (error) {
        console.error(error);
    }
}

(async (): Promise<void> => {
    await main();
})();

process
    .on('uncaughtException', (error: Record<string, any>) => {
        console.log('uncaughtException is detected , shutting down ...');
        console.log(error.name + ': ' + error.message);
        process.exit(1);
    })
    .on('unhandledRejection', (error: Record<string, any>) => {
        console.log('unhandledRejection is detected , shutting down ...');
        console.log(error.name + ': ' + error.message);
        process.exit(1);
    });
