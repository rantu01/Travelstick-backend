import config from './index';
import mongoose from 'mongoose';

const connectMongo = async (db_string: string): Promise<void> => {
    try {
        if (!db_string) {
            console.log('Database string not found');
            return;
        }
        await mongoose.connect(db_string);
        console.log('Database connection Successfully');
    } catch (error) {
        console.log(error);
        console.log('MongoDB connection failed \nRetrying in 2 seconds...');
        setTimeout(connectMongo, 2000);
    }
};
export default connectMongo;
