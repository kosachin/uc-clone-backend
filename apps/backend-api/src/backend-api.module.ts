import { Module } from '@nestjs/common';
import { BackendApiController } from './backend-api.controller';
import { BackendApiService } from './backend-api.service';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  controllers: [BackendApiController],
  providers: [BackendApiService],
})
export class BackendApiModule {}
