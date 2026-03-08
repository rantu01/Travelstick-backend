import { z } from 'zod';

const postSettingValidationSchema = z.object({
    body: z.object({
        site_name: z
            .string({
                invalid_type_error: 'site_name name must be string',
                required_error: 'site_name name is required',
            })
            .optional(),
        site_email: z
            .string({
                invalid_type_error: 'Email must be string',
                required_error: 'Email is required',
            })
            .email({
                message: 'Invalid email address',
            })
            .optional(),
        site_phone: z
            .string({
                invalid_type_error: 'phone number must be string',
                required_error: 'phone number is required',
            })
            .optional(),
        site_logo: z
            .string({
                invalid_type_error: 'logo must be string',
                required_error: 'logo is required',
            })
            .optional(),
        fav_icon: z
            .string({
                invalid_type_error: 'fav_icon must be string',
                required_error: 'fav_icon is required',
            })
            .optional(),
        site_address: z
            .string({
                invalid_type_error: 'address must be string',
                required_error: 'address is required',
            })
            .optional(),
        site_description: z
            .string({
                invalid_type_error: 'description must be string',
                required_error: 'description is required',
            })
            .optional(),
        site_footer: z
            .string({
                invalid_type_error: 'footer must be string',
                required_error: 'footer is required',
            })
            .optional(),
        currency_code: z
            .string({
                invalid_type_error: 'currency_code must be string',
                required_error: 'currency_code is required',
            })
            .optional(),
        currency_symbol: z
            .string({
                invalid_type_error: 'currency_symbol must be string',
                required_error: 'currency_symbol is required',
            })
            .optional(),
        client_side_url: z
            .string({
                invalid_type_error: 'client_side_url must be string',
                required_error: 'client_side_url is required',
            })
            .url({
                message: 'URL must be string',
            })
            .optional(),
        server_side_url: z
            .string({
                invalid_type_error: 'client_side_url must be string',
                required_error: 'client_side_url is required',
            })
            .url({
                message: 'URL must be a string',
            })
            .optional(),
        banner_image: z
            .string({
                invalid_type_error: 'banner_image must be string',
                required_error: 'banner_image is required',
            })
            .optional(),
        otp_verification_type: z
            .enum(['email', 'phone'], {
                message: 'otp_verification_type must be email or phone',
            })
            .optional(),
        file_upload_type: z
            .enum(['s3', 'local'], {
                required_error: 'file_upload_type is required',
                invalid_type_error: 'file_upload_type must be string',
                message: 'file_upload_type must be s3 or local',
            })
            .optional(),
        per_kiloliter_charge: z
            .number({
                invalid_type_error: 'per_kiloliter_charge must be number',
                required_error: 'per_kiloliter_charge is required',
            })
            .nonnegative({
                message:
                    'per_kiloliter_charge must be greater than or equal to 0',
            })
            .optional(),
        delivery_charge: z
            .number({
                invalid_type_error: 'delivery_charge must be number',
                required_error: 'delivery_charge is required',
            })
            .nonnegative({
                message: 'delivery_charge must be greater than or equal to 0',
            })
            .optional(),
        email_config: z
            .object(
                {
                    default: z
                        .enum(['gmail', 'sendgrid', "brevo"], {
                            message: 'default must be gmail or sendgrid',
                        })
                        .optional(),
                    sendgrid: z
                        .object(
                            {
                                host: z
                                    .string({
                                        invalid_type_error:
                                            'host must be string',
                                        required_error: 'host is required',
                                    })
                                    .optional(),
                                port: z
                                    .number({
                                        invalid_type_error:
                                            'port must be number',
                                        required_error: 'port is required',
                                    })
                                    .optional(),
                                username: z
                                    .string({
                                        invalid_type_error:
                                            'username must be string',
                                        required_error: 'username is required',
                                    })
                                    .optional(),
                                password: z
                                    .string({
                                        invalid_type_error:
                                            'password must be string',
                                        required_error: 'password is required',
                                    })
                                    .optional(),
                                sender_email: z
                                    .string({
                                        invalid_type_error:
                                            'sender_email must be string',
                                        required_error:
                                            'sender_email is required',
                                    })
                                    .optional(),
                            },
                            {
                                message: 'sendgrid must be object',
                            },
                        )
                        .optional(),
                    gmail: z
                        .object(
                            {
                                auth_email: z
                                    .string({
                                        invalid_type_error:
                                            'email must be string',
                                        required_error: 'email is required',
                                    })
                                    .optional(),
                                password: z
                                    .string({
                                        invalid_type_error:
                                            'password must be string',
                                        required_error: 'password is required',
                                    })
                                    .optional(),
                                service_provider: z
                                    .string({
                                        invalid_type_error:
                                            'service_provider must be string',
                                        required_error:
                                            'service_provider is required',
                                    })
                                    .optional(),
                            },
                            {
                                message: 'sendgrid must be object',
                            },
                        )
                        .optional(),
                    brevo: z
                        .object({
                            apiKey: z.string({
                                invalid_type_error: 'apiKey must be string',
                                required_error: 'apiKey is required',
                            }),
                        })
                        .optional(),
                },
                {
                    message: 'email_config must be object',
                },
            )
            .optional(),
        phone_config: z
            .object(
                {
                    twilio_auth_token: z
                        .string({
                            invalid_type_error:
                                'twilio_auth_token must be string',
                            required_error: 'twilio_auth_token is required',
                        })
                        .optional(),
                    twilio_sender_number: z
                        .string({
                            invalid_type_error:
                                'twilio_sender_number must be string',
                            required_error: 'twilio_sender_number is required',
                        })
                        .optional(),
                    twilio_account_sid: z
                        .string({
                            invalid_type_error:
                                'twilio_account_sid must be string',
                            required_error: 'twilio_account_sid is required',
                        })
                        .optional(),
                    is_active: z
                        .boolean({
                            invalid_type_error: 'active must be boolean',
                            required_error: 'active is required',
                        })
                        .optional(),
                },
                {
                    message: 'sms must be object',
                },
            )
            .optional(),
        //payment method -->
        stripe: z
            .object({
                credentials: z.object({
                    stripe_publishable_key: z
                        .string({
                            invalid_type_error:
                                'stripe publishable key must be string',
                            required_error:
                                'stripe publishable key is required',
                        })
                        .optional(),
                    stripe_secret_key: z
                        .string({
                            invalid_type_error:
                                'stripe secret key must be string',
                            required_error: 'stripe secret is required',
                        })
                        .optional(),
                    stripe_webhook_secret: z
                        .string({
                            invalid_type_error:
                                'stripe webhook secret must be string',
                            required_error: 'stripe webhook secret is required',
                        })
                        .optional(),
                }),
                is_active: z
                    .boolean({
                        invalid_type_error: 'Stripe is active must be boolean',
                        required_error: 'Stripe Is active must be boolean',
                    })
                    .optional(),
                logo: z
                    .string({
                        invalid_type_error: 'Stripe logo must be string',
                        required_error: 'Stripe logo is required',
                    })
                    .optional(),
                name: z.string({
                    invalid_type_error: 'Stripe name must be string',
                    required_error: 'Stripe name is required',
                }),
            })
            .optional(),
        paypal: z
            .object({
                credentials: z.object({
                    paypal_base_url: z
                        .string({
                            invalid_type_error:
                                'Paypal base url must be string',
                            required_error: 'Paypal base url is required',
                        })
                        .optional(),
                    paypal_client_id: z
                        .string({
                            invalid_type_error:
                                'Paypal client id must be string',
                            required_error: 'Paypal client id is required',
                        })
                        .optional(),
                    paypal_secret_key: z
                        .string({
                            invalid_type_error:
                                'Paypal secret key must be string',
                            required_error: 'Paypal secret key is required',
                        })
                        .optional(),
                    paypal_webhook_id: z
                        .string({
                            invalid_type_error:
                                'paypal webhook id must be string',
                            required_error: 'Paypal webhook id is required',
                        })
                        .optional(),
                }),
                is_active: z
                    .boolean({
                        invalid_type_error: 'Paypal is active must be boolean',
                        required_error: 'Paypal Is active must be boolean',
                    })
                    .optional(),
                logo: z
                    .string({
                        invalid_type_error: 'Paypal logo must be string',
                        required_error: 'Paypal logo is required',
                    })
                    .optional(),
                name: z.string({
                    invalid_type_error: 'Paypal name must be string',
                    required_error: 'Paypal name is required',
                }),
            })
            .optional(),
        razorpay: z
            .object({
                credentials: z.object({
                    razorpay_key_id: z
                        .string({
                            invalid_type_error:
                                'Razorpay key id must be string',
                            required_error: 'Razorpay key id is required',
                        })
                        .optional(),
                    razorpay_key_secret: z
                        .string({
                            invalid_type_error:
                                'Razorpay key secret must be string',
                            required_error: 'Razorpay key secret is required',
                        })
                        .optional(),
                }),
                is_active: z
                    .boolean({
                        invalid_type_error:
                            'Razorpay is active must be boolean',
                        required_error: 'Razorpay Is active must be boolean',
                    })
                    .optional(),
                logo: z
                    .string({
                        invalid_type_error: 'Razorpay logo must be string',
                        required_error: 'Razorpay logo is required',
                    })
                    .optional(),
                name: z.string({
                    invalid_type_error: 'Razorpay name must be string',
                    required_error: 'Razorpay name is required',
                }),
            })
            .optional(),
        social_media_link: z
            .array(
                z.object({
                    name: z.string({
                        invalid_type_error:
                            'social_media_link name must be a string',
                        required_error: 'social_media_link name is required',
                    }),
                    link: z.string({
                        invalid_type_error:
                            'social_media_link link must be a string',
                        required_error: 'social_media_link link is required',
                    }),
                }),
                {
                    message: 'social_media_link must be an array of objects',
                },
            )
            .optional(),
        is_product_module: z
            .boolean({
                required_error: 'is_product_module is required',
                invalid_type_error: 'is_product_module must be boolean',
            })
            .optional(),
        partner: z
            .array(
                z.object({
                    text: z.string({
                        invalid_type_error: 'Partner name must be a string',
                        required_error: 'Partner name is required',
                    }),
                    url: z.string({
                        invalid_type_error: 'Partner image URL must be a string',
                        required_error: 'Partner image is required',
                    }),
                }),
                {
                    message: 'Partner must be an array of objects containing name and image',
                }
            )
            .optional(),
        gallery: z
            .array(
                z.string({
                    invalid_type_error: 'gallery must be a string',
                    required_error: 'gallery is required',
                }),
                {
                    message: 'gallery url must be array',
                },
            )
            .optional(),
    }),
});

export const SettingValidations = {
    postSettingValidationSchema,
};
