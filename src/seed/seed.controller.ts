import { Controller, Post, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('/seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}

  @Post('')
  async seedData(): Promise<string> {
    Logger.log('seeding fake data into database');
    try {
      await this.seedService.seedData();
      return 'Database seeding completed successfully';
    } catch (error) {
      return `Error seeding database: ${error}`;
    }
  }
}
