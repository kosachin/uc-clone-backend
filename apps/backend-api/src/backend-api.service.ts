import { Injectable } from '@nestjs/common';

@Injectable()
export class BackendApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
