import { parentPort, workerData } from 'node:worker_threads';
import { sendUserEmailGeneral } from './sendEmail';
import connectMongo from '../config/database';
import config from '../config';

(async () => {
    try {
        await connectMongo(config.db_string as string);
        for (const value of workerData) {
            await sendUserEmailGeneral(value);
        }
        if (parentPort) {
            parentPort.postMessage({ success: true, email: workerData.email });
        }
    } catch (error: any) {
        if (parentPort) {
            parentPort.postMessage({
                success: false,
                email: workerData.email,
                error: error,
            });
        }
    }
})();
