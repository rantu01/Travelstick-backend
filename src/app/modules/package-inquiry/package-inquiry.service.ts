import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import PackageInquiry from './package-inquiry.model';

export class PackageInquiryService {
    static async createPackageInquiry(payload: any) {
        const data = await PackageInquiry.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create package inquiry. Please check all fields and try again.',
            );
        }
        return data;
    }

    static async findPackageInquiryById(_id: string | Types.ObjectId) {
        const data = await PackageInquiry.findById(_id)
            .populate('package', 'name card_image')
            .select('-updatedAt -__v');

        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Package inquiry not found. Please check inquiry id and try again.',
            );
        }

        return data;
    }

    static async findPackageInquiryWithPagination(
        filter: Record<string, any>,
        query: Record<string, any>,
        select: Record<string, any>,
    ) {
        const searchTerm = query.search?.toString() || '';

        const aggregate = PackageInquiry.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'package',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                card_image: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$package',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ...(query.search
                ? [
                      {
                          $match: {
                              $or: [
                                  {
                                      full_name: {
                                          $regex: searchTerm,
                                          $options: 'i',
                                      },
                                  },
                                  {
                                      email: {
                                          $regex: searchTerm,
                                          $options: 'i',
                                      },
                                  },
                                  {
                                      [`package.name.${query.langCode || 'en'}`]: {
                                          $regex: searchTerm,
                                          $options: 'i',
                                      },
                                  },
                              ],
                          },
                      },
                  ]
                : []),
            {
                $project: select,
            },
        ]);

        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };

        return await PackageInquiry.aggregatePaginate(aggregate, options);
    }

    static async deletePackageInquiryById(_id: string | Types.ObjectId) {
        return await PackageInquiry.findByIdAndDelete(_id).select(
            '-updatedAt -__v',
        );
    }
}
