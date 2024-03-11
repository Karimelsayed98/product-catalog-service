import { Controller, Get, Logger, Query } from '@nestjs/common';

import { ProductsService } from './products.service';
import { GetSearchProductsResponse } from './dto/get-search-products.dto';
import { SearchInternalServerError } from '../common/exceptions/SearchInternalServerError';

@Controller('/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  public constructor(private readonly productsService: ProductsService) {}

  @Get('/search')
  async search(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<GetSearchProductsResponse> {
    this.logger.log(`Searching for products with query ${query}`);

    try {
      const data = await this.productsService.search(query, page, pageSize);
      return data;
    } catch (error) {
      throw new SearchInternalServerError(error);
    }
  }
}
