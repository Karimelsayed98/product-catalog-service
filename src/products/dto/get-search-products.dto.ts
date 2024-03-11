import { Supplier } from '../../suppliers/schemas/supplier.schema';
import { Product, Variant } from '../schemas/product.schema';
import { Category } from '../../categories/schemas/category.schema';

export class ProductInSearchDto {
  id: string;
  name: string;
  soldCount: number;
  variants: Variant[];
  supplier: Supplier;
  category: Category;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.soldCount = product.soldCount;
    this.variants = product.variants;
    this.supplier = new Supplier(product.supplier);
    this.category = new Category(product.category);
  }
}

export class GetSearchProductsResponse {
  products: ProductInSearchDto[];
  totalPages: number;

  constructor(products: Product[], totalPages: number) {
    this.products = products.map((product) => new ProductInSearchDto(product));
    this.totalPages = totalPages;
  }
}
