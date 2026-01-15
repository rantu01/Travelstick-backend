import { z } from 'zod';
type Tservices = { title: Record<string, string>; module: string }[];
export const USER_ROLE = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    USER: 'user',
} as const;
export const USER_ROLE_ENUM: string[] = Object.values(USER_ROLE);
export const USER_GENDER_ENUM: string[] = ['male', 'female', 'other'];
export const dictionary: number[] = [
    49, //1
    50, //2
    51, //3
    52, //4
    53, //5
    54, //6
    56, //7
    55, //8
    57, //9
    65, //A
    66, //B
    67, //C
    68, //D
    69, //E
    70, //F
    71, //G
    72, //H
    74, //J
    75, //K
    76, //L
    77, //M
    78, //N
    80, //P
    81, //Q
    82, //R
    83, //S
    84, //T
    85, //U
    86, //V
    87, //W
    88, //X
    89, //Y
    90, //Z
];

export const languageEnum = z.enum([
    'en',
    'bn',
    'es',
    'fr',
    'de',
    'zh',
    'ja',
    'ru',
    'pt',
    'it',
    'ar',
    'ko',
    'hi',
    'tr',
    'nl',
    'sv',
    'da',
    'no',
    'fi',
    'el',
    'th',
    'he',
    'cs',
    'hu',
    'ro',
    'sk',
    'bg',
    'vi',
    'ms',
    'id',
    'tl',
    'sw',
]);

export const countryEnum = z.enum([
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CHF',
    'CAD',
    'AUD',
    'CNY',
    'INR',
    'BRL',
    'ZAR',
    'MXN',
    'SGD',
    'HKD',
    'NZD',
    'RUB',
    'TRY',
    'KRW',
    'SEK',
    'NOK',
    'DKK',
    'THB',
    'ILS',
    'PHP',
    'MYR',
    'VND',
    'IDR',
    'COP',
    'CLP',
    'CZK',
    'HUF',
    'RON',
    'BGN',
    'AED',
    'QAR',
    'SAR',
    'OMR',
    'KWD',
    'BHD',
    'JOD',
    'AMD',
    'GEL',
    'KZT',
    'UZS',
    'TWD',
    'PKR',
    'NPR',
    'MNT',
    'DOP',
    'PEN',
    'BAM',
    'HRK',
    'ISK',
    'MDL',
    'LTL',
    'LVL',
    'AZN',
    'XOF',
    'XAF',
    'XPF',
    'SCR',
    'SLL',
    'SOS',
    'TJS',
    'KGS',
    'AFN',
    'LKR',
    'BBD',
    'JMD',
    'TTD',
    'XCD',
    'KYD',
    'BMD',
    'FJD',
    'WST',
    'PGK',
    'VUV',
    'XDR',
]);

export const services: Tservices = [
    {
        title: {
            en: 'Pickup From Home',
        },
        module: 'package',
    },
    {
        title: {
            en: 'Accommodation Upgrades',
        },
        module: 'package',
    },
    {
        title: {
            en: 'Exclusive Access',
        },
        module: 'package',
    },
    {
        title: {
            en: 'Pickup From Home',
        },
        module: 'room',
    },
    {
        title: {
            en: 'Accommodation Upgrades',
        },
        module: 'room',
    },
    {
        title: {
            en: 'Exclusive Access',
        },
        module: 'room',
    },
];

export const pages = [
    {
        slug: 'terms_and_conditions',
        status: true,
    },
    {
        slug: 'privacy_policy',
        status: true,
    },
    {
        slug: 'about',
        status: true,
    },
    {
        slug: 'contact_us',
        status: true,
    },
    {
        slug: 'home_page',
        theme: 'one',
        status: true,
        content: {
            hero: {
                heading: 'string',
                description: 'string',
                short_description: 'string',
                image1: 'string',
                image2: 'string',
                image3: 'string',
                video: 'string',
            },
            about: {
                heading: 'string',
                description: 'string',
                image: 'string',
            },
        },
    },
    {
        slug: 'home_page',
        theme: 'two',
        status: true,
        content: {
            hero: {
                heading: 'string',
                description: 'string',
                short_description: 'string',
                image1: 'string',
                image2: 'string',
                image3: 'string',
                video: 'string',
            },
            about: {
                heading: 'string',
                description: 'string',
                image: 'string',
            },
        },
    },
];

export const sections = [
    {
        name: 'string',
        content: {
            heading: 'string',
            title: 'string',
            data: [
                {
                    heading: 'string',
                    description: 'string',
                    logo: 'string',
                },
            ],
        },
    },
];
