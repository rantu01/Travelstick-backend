import express, { Request, Response } from 'express';
import middleware from './app/middleware';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundHandler from './app/middleware/notFoundHandler';
import router from './app/routes';
import path from 'node:path';
import cors from 'cors';

const app = express();


// 1️⃣ CORS first
app.use(cors({
    origin: ["https://banglaco.com", "http://localhost:3998","https://www.banglaco.com"],
    credentials: true
}));

// 2️⃣ Other middleware
app.use(middleware);

// 3️⃣ Static files
app.use('/public', express.static(path.join(__dirname, './../public')));

// 4️⃣ API routes
app.use('/api/v1', router);

// 5️⃣ Root route
app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: "You're Welcome to My App💥",
    });
});

// 6️⃣ Error handlers
app.use(globalErrorHandler);
app.use(notFoundHandler);

export { app };
