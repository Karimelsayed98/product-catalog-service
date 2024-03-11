import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetSearchProductsResponse } from './dto/get-search-products.dto';

@Controller('/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  public constructor(private readonly productsService: ProductsService) {}

  // Add dto to query and respose
  @Get('/search')
  async search(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<GetSearchProductsResponse> {
    this.logger.log(`Searching for products with query ${query}`);

    const data = await this.productsService.search(query, page, pageSize);

    return data;
  }
}
