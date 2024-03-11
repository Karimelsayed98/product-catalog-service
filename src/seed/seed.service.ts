import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

import { Product } from '../products/schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';
import { Supplier } from '../suppliers/schemas/supplier.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>,
  ) {}

  public async seedData(): Promise<void> {
    try {
      await this.seedCategories();
      await this.seedSuppliers();
      await this.seedProducts();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error(`Error seeding database: ${error}`);
      throw error;
    }
  }

  private async seedProducts(): Promise<void> {
    const products = await Promise.all(
      Array.from({ length: 5 }).map(
        async () => await this.generateProductData(),
      ),
    );
    await this.productModel.insertMany(products);
    this.logger.log('Products seeded successfully');
  }

  private async seedCategories(): Promise<void> {
    const categories = Array.from({ length: 5 }).map(this.generateCategoryData);
    await this.categoryModel.insertMany(categories);
    this.logger.log('Categories seeded successfully');
  }

  private async seedSuppliers(): Promise<void> {
    const suppliers = Array.from({ length: 5 }).map(this.generateSupplierData);
    await this.supplierModel.insertMany(suppliers);
    this.logger.log('Suppliers seeded successfully');
  }

  private generateProductData = async (): Promise<Promise<any>> => {
    const name = faker.commerce.productName();
    const soldCount = faker.number.int({ min: 0, max: 1000 });
    const variants = Array.from({
      length: faker.number.int({ min: 1, max: 10 }),
    }).map(() => ({
      size: faker.helpers.arrayElement(['Small', 'Medium', 'Large']),
      color: faker.color.human(),
      style: faker.helpers.arrayElement(['V-Neck', 'Rounded-Neck']),
      stock: faker.number.int({ min: 0, max: 100 }),
    }));
    const supplier = await this.supplierModel.aggregate([
      { $sample: { size: 1 } },
    ]);
    const category = await this.categoryModel.aggregate([
      { $sample: { size: 1 } },
    ]);
    return { name, soldCount, variants, supplier, category };
  };

  private generateCategoryData = (): any => ({
    name: faker.commerce.department(),
  });

  private generateSupplierData = (): any => ({
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
  });
}
