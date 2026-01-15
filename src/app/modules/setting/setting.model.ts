import { model, Schema } from 'mongoose';
import { TSetting } from './setting.interface';

const schema = new Schema<TSetting>(
    {
        site_name: String,
        site_email: String,
        site_phone: String,
        site_logo: String,
        fav_icon: String,
        site_address: String,
        site_description: String,
        site_footer: String,
        currency_code: String,
        currency_symbol: String,
        client_side_url: String,
        server_side_url: String,
        banner_image: String,
        per_kiloliter_charge: {
            type: Number,
            default: 0,
        },
        delivery_charge: {
            type: Number,
            default: 0,
        },
        otp_verification_type: {
            type: String,
            enum: ['email', 'phone'],
            default: 'email',
            message: '{VALUE} is not a valid otp verification type',
        },
        file_upload_type: {
            type: String,
            enum: ['local', 's3'],
            default: 'local',
            message: '{VALUE} is not a valid file upload type',
        },
        email_config: {
            default: {
                type: String,
                enum: ['gmail', 'sendgrid' , "brevo"],
                default: 'sendgrid',
            },
            sendgrid: {
                host: String,
                port: Number,
                username: String,
                password: String,
                sender_email: String,
            },
            gmail: {
                auth_email: String,
                password: String,
                service_provider: String,
            },
            brevo: {
                apiKey: String,
            },
        },
        phone_config: {
            twilio_auth_token: String,
            twilio_sender_number: String,
            twilio_account_sid: String,
            is_active: Boolean,
        },
        stripe: {
            credentials: {
                stripe_publishable_key: String,
                stripe_secret_key: String,
                stripe_webhook_secret: String,
            },
            is_active: Boolean,
            logo: String,
            name: String,
        },
        paypal: {
            credentials: {
                paypal_base_url: String,
                paypal_client_id: String,
                paypal_secret_key: String,
                paypal_webhook_id: String,
            },
            is_active: Boolean,
            logo: String,
            name: String,
        },
        razorpay: {
            credentials: {
                razorpay_key_id: String,
                razorpay_key_secret: String,
            },
            is_active: Boolean,
            logo: String,
            name: String,
        },
        social_media_link: {
            type: [
                {
                    name: String,
                    link: String,
                },
            ],
            default: undefined,
        },
        is_product_module: {
            type: Boolean,
            default: true,
        },
        gallery: {
            type: [String],
            default: undefined,
        },
        partner: {
            type: [String],
            default: undefined,
        },
    },
    {
        timestamps: true,
    },
);
const Setting = model<TSetting>('setting', schema);
export default Setting;
