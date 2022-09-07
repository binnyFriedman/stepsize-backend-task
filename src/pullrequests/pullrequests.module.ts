import { Module } from '@nestjs/common';
import { PullrequestsController } from './pullrequests.controller';
import { PullRequestsService } from './pullrequests.service';
import { GitHubDriver } from './github/driver';
import { CodeHostingDriver } from './dto/PullRequest.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PullRequestPayload } from './entities/PullRequestTrack.entity';

const codeHostingProvidersFactory: () => CodeHostingDriver[] = () => {
  return [new GitHubDriver()];
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
