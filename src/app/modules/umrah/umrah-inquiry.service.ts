import { IUmrahInquiry } from './umrah-inquiry.interface';
import UmrahInquiry from './umrah-inquiry.model';

const createUmrahInquiry = async (payload: IUmrahInquiry): Promise<IUmrahInquiry> => {
  const result = await UmrahInquiry.create(payload);
  return result;
};

const getAllUmrahInquiries = async (): Promise<IUmrahInquiry[]> => {
  const result = await UmrahInquiry.find().sort({ createdAt: -1 });
  return result;
};

const getSingleUmrahInquiry = async (id: string): Promise<IUmrahInquiry | null> => {
  const result = await UmrahInquiry.findById(id);
  return result;
};

const updateUmrahInquiry = async (
  id: string,
  payload: Partial<IUmrahInquiry>
): Promise<IUmrahInquiry | null> => {
  const result = await UmrahInquiry.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteUmrahInquiry = async (id: string): Promise<IUmrahInquiry | null> => {
  const result = await UmrahInquiry.findByIdAndDelete(id);
  return result;
};

export const UmrahInquiryService = {
  createUmrahInquiry,
  getAllUmrahInquiries,
  getSingleUmrahInquiry,
  updateUmrahInquiry,
  deleteUmrahInquiry,
};