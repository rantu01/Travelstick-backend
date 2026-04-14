import express, { Request, Response } from 'express';
import middleware from './app/middleware';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundHandler from './app/middleware/notFoundHandler';
import router from './app/routes';
import path from 'node:path';
import cors, { CorsOptions } from 'cors';
import config from './app/config';

const app = express();

const normalizeOrigin = (origin: string): string => origin.replace(/\/$/, '');

const defaultAllowedOrigins = [
    'https://banglaco.com',
    'https://www.banglaco.com',
    'https://api.banglaco.com',
    'http://localhost:3000',
    'http://localhost:3998',
];

const envAllowedOrigins = [
    config.client_side_url,
    config.server_side_url,
    ...(config.cors_origins || '')
        .split(',')
        .map((item) => item.trim()),
].filter(Boolean) as string[];

const allowedOrigins = new Set(
    [...defaultAllowedOrigins, ...envAllowedOrigins].map((origin) =>
        normalizeOrigin(origin),
    ),
);

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = normalizeOrigin(origin);
        if (allowedOrigins.has(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204,
};

// 1️⃣ CORS first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2️⃣ Body size limit — middleware এর আগেই দিতে হবে ✅
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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
