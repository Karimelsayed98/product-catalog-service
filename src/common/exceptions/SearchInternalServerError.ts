import { InternalServerErrorException } from '@nestjs/common';

export class SearchInternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(`search internal error: ${message}`);
  }
}
