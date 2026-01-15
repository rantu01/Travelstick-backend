import nodemailer from 'nodemailer';
import Setting from '../modules/setting/setting.model';
import axios from 'axios';
export type TData = {
    email: string;
    subject: string;
    message: string;
};

export const sendUserEmailGeneral = async (data: TData) => {
    const setting = await Setting.findOne({}).select('email_config site_name site_email').lean();
    let transporter: any, from_email;

    if (setting.email_config.default == 'brevo') {
        return await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: setting.site_name,
                    email: setting.site_email,
                },
                to: [
                    {
                        email: data.email,
                    },
                ],
                subject: data.subject,
                htmlContent: data.message,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'api-key': `${setting.email_config.brevo.apiKey}`,
                },
            },
        );
    } else if (setting?.email_config?.default === 'sendgrid') {
        transporter = nodemailer.createTransport({
            // @ts-ignore
            host: setting?.email_config?.sendgrid?.host,
            port: setting?.email_config?.sendgrid?.port,
            secure: false,
            auth: {
                user: setting.email_config?.sendgrid?.sender_email,
                pass: setting?.email_config?.sendgrid?.password,
            },
        });
        from_email = setting?.email_config?.sendgrid?.sender_email;
    } else if (setting?.email_config?.default === 'gmail') {
        transporter = nodemailer.createTransport({
            secure: false,
            service: setting?.email_config?.gmail?.service_provider,
            auth: {
                user: setting?.email_config?.gmail?.auth_email,
                pass: setting?.email_config?.gmail?.password,
            },
        });
        from_email = setting?.email_config?.gmail?.auth_email;
    }
    return await transporter.sendMail({
        from: from_email, // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        html: data.message, // html body
    });
};
