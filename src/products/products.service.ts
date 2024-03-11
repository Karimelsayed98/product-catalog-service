import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { GetSearchProductsResponse } from './dto/get-search-products.dto';

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
      .populate({
        path: 'supplier',
        select: ['name'],
      })
      .populate({
        path: 'category',
        select: ['name'],
      })
      .sort({ soldCount: 'desc' })
      .skip(skip)
      .limit(pageSize)
      .lean();

    return new GetSearchProductsResponse(products, totalPages);
  }
}
