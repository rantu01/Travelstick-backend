import morgan from 'morgan';
import config from './../config';
import compression from 'compression';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const customHeader = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    next();
};
const customJson = (req: Request, res: Response, next: NextFunction): void => {
    if (req.originalUrl == '/api/v1/payments/stripe/webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
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
    express.urlencoded({ extended: true }),
    customHeader,
    customJson,
    cors({ credentials: true }),
];
export default middleware;
