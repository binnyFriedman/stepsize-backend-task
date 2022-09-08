import { Module } from '@nestjs/common';
import { PullrequestsController } from './pullrequests.controller';
import { PullRequestsService } from './pullrequests.service';
import { GitHubDriver } from './github/driver';
import { ICodeHostingProvider } from './dto/PullRequest.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestPayload } from './entities/PullRequestTrack.entity';
import { MockBitbucketClient } from './bitbucket';

const codeHostingProvidersFactory: () => ICodeHostingProvider[] = () => {
  return [new GitHubDriver(), new MockBitbucketClient()];
};

@Module({
  imports: [TypeOrmModule.forFeature([PullRequestPayload])],
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
