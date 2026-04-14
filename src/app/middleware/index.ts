import morgan from 'morgan';
import config from './../config';
import compression from 'compression';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const customJson = (req: Request, res: Response, next: NextFunction): void => {
    if (req.originalUrl == '/api/v1/payments/stripe/webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        // ✅ 50mb limit যোগ করা হয়েছে
        express.json({ limit: '50mb' })(req, res, next);
    }
};

const middleware = [
    morgan(config.node_env == 'dev' ? 'dev' : 'combined'),
    compression(),
    fileUpload({
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
    }),
    helmet({
        crossOriginResourcePolicy: false,
    }),
    cookieParser(),
    // ✅ 50mb limit যোগ করা হয়েছে
    express.urlencoded({ limit: '50mb', extended: true }),
    customJson,
];
export default middleware;