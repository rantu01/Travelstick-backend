import { Schema, model } from 'mongoose';
import { ICustomTourRequest } from './custom-tour-request.interface';

const CustomTourRequestSchema = new Schema<ICustomTourRequest>(
  {
    selectedDestination: {
      type: String,
      trim: true,
    },
    customDestination: {
      type: String,
      trim: true,
    },
    travelDate: {
      type: Date,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    requirements: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const CustomTourRequest = model<ICustomTourRequest>(
  'CustomTourRequest',
  CustomTourRequestSchema,
);

export default CustomTourRequest;
