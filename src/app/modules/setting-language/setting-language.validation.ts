import { z } from 'zod';

const postLanguageSettingValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: 'name must be string',
            required_error: 'name is required',
        }),
        code: z.string({
            invalid_type_error: 'code must be string',
            required_error: 'code is required',
        }),
        rtl: z.boolean({
            invalid_type_error: 'rtl must be boolean',
            required_error: 'rtl is required',
        }),
        flag: z.string({
            invalid_type_error: 'flag must be string',
            required_error: 'flag is required',
        }),
        translations: z.any().optional(),
        active: z
            .boolean({
                invalid_type_error: 'active must be boolean',
                required_error: 'active is required',
            })
            .optional()
            .default(true),
        default: z
            .boolean({
                invalid_type_error: 'boolean must be string',
                required_error: 'boolean is required',
            })
            .optional(),
    }),
});

const updateLanguageSettingValidationSchema = z.object({
    body: z.object({
        _id: z.string({
            invalid_type_error: '_id must be string',
            required_error: '_id is required',
        }),
        name: z
            .string({
                invalid_type_error: 'name must be string',
                required_error: 'name is required',
            })
            .optional(),
        code: z
            .string({
                invalid_type_error: 'code must be string',
                required_error: 'code is required',
            })
            .optional(),
        rtl: z
            .boolean({
                invalid_type_error: 'rtl must be boolean',
                required_error: 'rtl is required',
            })
            .optional(),
        flag: z
            .string({
                invalid_type_error: 'flag must be string',
                required_error: 'flag is required',
            })
            .optional(),
        translations: z.any().optional(),
        active: z
            .boolean({
                invalid_type_error: 'active must be boolean',
                required_error: 'active is required',
            })
            .optional(),
        default: z
            .boolean({
                invalid_type_error: 'boolean must be string',
                required_error: 'boolean is required',
            })
            .optional(),
    }),
});
export const SettingLanguageValidations = {
    postLanguageSettingValidationSchema,
    updateLanguageSettingValidationSchema,
};
