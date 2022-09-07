import { Module } from '@nestjs/common';
import { PullrequestsController } from './pullrequests.controller';
import { PullRequestsService } from './pullrequests.service';
import { GitHubDriver } from './github/driver';
import { CodeHostingDriver } from './dto/PullRequest.dto';

const codeHostingProvidersFactory: () => CodeHostingDriver[] = () => {
  return [new GitHubDriver()];
};

@Module({
  controllers: [PullrequestsController],
  providers: [
    {
      provide: 'CodeHostingDrivers',
      useFactory: codeHostingProvidersFactory,
    },
    PullRequestsService,
  ],
  exports: [PullRequestsService],
})
export class PullrequestsModule {}
