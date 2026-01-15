import { Worker } from 'node:worker_threads';
export async function createThread(
    file: string,
    workerData: any,
): Promise<any> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(file, { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            resolve(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}
