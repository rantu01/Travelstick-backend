import { ICustomTourRequest } from './custom-tour-request.interface';
import CustomTourRequest from './custom-tour-request.model';

const createCustomTourRequest = async (
  payload: ICustomTourRequest,
): Promise<ICustomTourRequest> => {
  const result = await CustomTourRequest.create(payload);
  return result;
};

const getAllCustomTourRequests = async (): Promise<ICustomTourRequest[]> => {
  const result = await CustomTourRequest.find().sort({ createdAt: -1 });
  return result;
};

const updateCustomTourRequest = async (
  id: string,
  payload: Partial<ICustomTourRequest>,
): Promise<ICustomTourRequest | null> => {
  const result = await CustomTourRequest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCustomTourRequest = async (
  id: string,
): Promise<ICustomTourRequest | null> => {
  const result = await CustomTourRequest.findByIdAndDelete(id);
  return result;
};

export const CustomTourRequestService = {
  createCustomTourRequest,
  getAllCustomTourRequests,
  updateCustomTourRequest,
  deleteCustomTourRequest,
};
