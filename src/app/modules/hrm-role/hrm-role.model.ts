import { model, Schema } from 'mongoose';
import { TRole } from './hrm-role.interface';
const schema = new Schema<TRole>(
    {
        name: {
            type: String,
            required: true,
        },
        permissions: [String],
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Role = model<TRole>('hrm_role', schema);

export default Role;
