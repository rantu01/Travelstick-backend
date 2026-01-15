import { dictionary } from './constants';

export const generateRandomNumber = (length: number = 8, max: number) => {
    const randomNumber = [];
    for (let i = 0; i < length; i++) {
        randomNumber.push(dictionary[Math.round(Math.random() * max)]);
    }
    return randomNumber;
};

export const generateID = (prefix: string, length: number) => {
    return prefix + String.fromCharCode(...generateRandomNumber(10, length));
};
