import { Test, TestingModule } from '@nestjs/testing';
import { PullrequestsController } from './pullrequests.controller';

describe('PullrequestsController', () => {
  let controller: PullrequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullrequestsController],
    }).compile();

    controller = module.get<PullrequestsController>(PullrequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
