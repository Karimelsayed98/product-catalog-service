import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';

import { ProductsService } from '../products.service';
import { Product, ProductDocument, Style } from '../schemas/product.schema';
import { GetSearchProductsResponse } from '../dto/get-search-products.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            countDocuments: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockProductModel = module.get<Model<ProductDocument>>(
      getModelToken(Product.name),
    );
  });

  it('should return no search results if query does not match any products', async () => {
    const query = 'nonexistent';
    const page = 1;
    const pageSize = 10;
    const count = 0;
    const totalPages = 0;
    const products = [];

    const expectedResponse = new GetSearchProductsResponse(
      products,
      totalPages,
    );

    // Mock the behavior of Mongoose methods
    jest.spyOn(mockProductModel, 'countDocuments').mockResolvedValue(count);
    jest.spyOn(mockProductModel, 'find').mockImplementation(
      () =>
        ({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(products),
        }) as unknown as Query<ProductDocument[], ProductDocument>,
    );

    const result = await service.search(query, page, pageSize);

    expect(result).toEqual(expectedResponse);
    expect(mockProductModel.countDocuments).toHaveBeenCalledWith(
      expect.any(Object),
    );
    expect(mockProductModel.find).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should return search results if query matches products', async () => {
    const query = 'product'; // Assume this query matches some products by name
    const page = 1;
    const pageSize = 10;
    const count = 10;
    const totalPages = 1;
    const products = [
      {
        id: '1',
        name: 'Product 1',
        soldCount: 5,
        variants: [{ size: 'M', color: 'Red', style: Style.V_NECK, stock: 10 }],
        supplier: { id: 'supplier_id_1', name: 'Supplier 1' },
        category: { id: 'category_id_1', name: 'Category 1' },
      },
      {
        id: '2',
        name: 'Product 2',
        soldCount: 8,
        variants: [
          { size: 'L', color: 'Blue', style: Style.ROUNDED_NECK, stock: 15 },
        ],
        supplier: { id: 'supplier_id_2', name: 'Supplier 2' },
        category: { id: 'category_id_2', name: 'Category 2' },
      },
    ];

    const expectedResponse = new GetSearchProductsResponse(
      products,
      totalPages,
    );

    // Mock the behavior of Mongoose methods
    jest.spyOn(mockProductModel, 'countDocuments').mockResolvedValue(count);
    jest.spyOn(mockProductModel, 'find').mockImplementation(
      () =>
        ({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(products),
        }) as unknown as Query<ProductDocument[], ProductDocument>,
    );

    const result = await service.search(query, page, pageSize);

    expect(result).toEqual(expectedResponse);
    expect(mockProductModel.countDocuments).toHaveBeenCalledWith(
      expect.any(Object),
    );
    expect(mockProductModel.find).toHaveBeenCalledWith(expect.any(Object));
  });
});
