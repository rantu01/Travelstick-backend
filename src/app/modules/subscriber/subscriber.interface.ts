import { Document } from 'mongoose';

export interface TSubscriber extends Document {
    email: string;
}
