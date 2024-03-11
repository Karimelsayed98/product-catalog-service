import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './schemas/product.schema';
import { GetSearchProductsResponse } from './dto/get-search-products.dto';
import { SearchInternalServerError } from '../common/exceptions/SearchInternalServerError';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  public async search(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<GetSearchProductsResponse> {
    try {
      const searchRegex = new RegExp(query, 'i');
      const dbQuery = {
        $or: [
          { name: searchRegex },
          {
            'variants.color': searchRegex,
          },
          {
            'variants.size': searchRegex,
          },
          {
            'variants.style': searchRegex,
          },
          {
            'supplier.name': searchRegex,
          },
          {
            'category.name': searchRegex,
          },
        ],
      };
      const count = await this.productModel.countDocuments(dbQuery);
      const totalPages = Math.ceil(count / pageSize);
      const skip = (page - 1) * pageSize;

      const products = await this.productModel
        .find(dbQuery)
        .sort({ soldCount: 'desc' })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'supplier',
          select: ['name'],
        })
        .populate({
          path: 'category',
          select: ['name'],
        })
        .lean()
        .exec();

      return new GetSearchProductsResponse(products, totalPages);
    } catch (error) {
      throw new SearchInternalServerError(error);
    }
  }
}
