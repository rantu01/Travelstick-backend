export type TSetting = {
    site_name?: string;
    site_email?: string;
    site_phone?: string;
    site_logo?: string;
    fav_icon: string;
    site_address?: string;
    site_description?: string;
    site_footer?: string;
    currency_code?: string;
    currency_symbol?: string;
    client_side_url?: string;
    server_side_url?: string;
    banner_image: string;
    otp_verification_type?: 'email' | 'phone';
    file_upload_type: 'local' | 's3';
    per_kiloliter_charge: number;
    delivery_charge: number;
    is_product_module: boolean;
    email_config: {
        default: string;
        sendgrid: {
            host: string;
            port: number;
            username: string;
            password: string;
            sender_email: string;
        };
        gmail: {
            auth_email: string;
            password: string;
            service_provider: string;
        };
    };
    phone_config: {
        twilio_auth_token: string;
        twilio_sender_number: string;
        twilio_account_sid: string;
        is_active: boolean;
    };
    stripe: {
        credentials: {
            stripe_publishable_key: string;
            stripe_secret_key: string;
            stripe_webhook_secret: string;
        };
        is_active: string;
        logo: string;
        name: string;
    };
    paypal: {
        credentials: {
            paypal_base_url: string;
            paypal_client_id: string;
            paypal_secret_key: string;
            paypal_webhook_id: string;
        };
        is_active: boolean;
        logo: string;
        name: string;
    };
    razorpay: {
        credentials: {
            razorpay_key_id: string;
            razorpay_key_secret: string;
        };
        is_active: boolean;
        logo: string;
        name: string;
    };
    social_media_link?: [
        {
            name: string;
            link: string;
        },
    ];
    gallery: string[];
    partner: {
        url: string;
        text: string;
    }[];
};
