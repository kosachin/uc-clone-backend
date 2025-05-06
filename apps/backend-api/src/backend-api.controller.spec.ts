import { Test, TestingModule } from '@nestjs/testing';
import { BackendApiController } from './backend-api.controller';
import { BackendApiService } from './backend-api.service';

describe('BackendApiController', () => {
  let backendApiController: BackendApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BackendApiController],
      providers: [BackendApiService],
    }).compile();

    backendApiController = app.get<BackendApiController>(BackendApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(backendApiController.getHello()).toBe('Hello World!');
    });
  });
});
