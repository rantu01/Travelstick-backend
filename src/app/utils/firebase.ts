import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import firebaseService from './firebase-service.json';

const firebaseAdmin = initializeApp({
    credential: cert(firebaseService as ServiceAccount),
});
export default firebaseAdmin;
