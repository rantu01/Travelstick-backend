import { Schema, model } from 'mongoose';
import { IUmrahInquiry } from './umrah-inquiry.interface';

const UmrahInquirySchema = new Schema<IUmrahInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    reachBy: {
      type: String,
      enum: ['WhatsApp', 'Phone Call', 'Email'],
      default: 'WhatsApp',
    },
    question: {
      type: String,
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const UmrahInquiry = model<IUmrahInquiry>('UmrahInquiry', UmrahInquirySchema);

export default UmrahInquiry;