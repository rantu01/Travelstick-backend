import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TTokenPayload } from './auth.interface';
import bcrypt from 'bcrypt';

export const validEmailCheck = (email: string) => {
    const schema = z.string().email();
    return schema.safeParse(email);
};
export const createToken = (
    payload: TTokenPayload,
    secret: string,
    expiresIn: string,
) => {
    // @ts-ignore
    return jwt.sign(payload, secret, { expiresIn });
};
export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload;
};
export const comparePassword = (password: string, hashPassword: string) => {
    return bcrypt.compare(password, hashPassword);
};
