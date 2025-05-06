import { Controller, Get } from '@nestjs/common';
import { BackendApiService } from './backend-api.service';

@Controller()
export class BackendApiController {
  constructor(private readonly backendApiService: BackendApiService) {}

  @Get()
  getHello(): string {
    return this.backendApiService.getHello();
  }
}
