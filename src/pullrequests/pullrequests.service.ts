import { Inject, Injectable } from '@nestjs/common';
import {
  CodeHostingDriver,
  GetPullRequestsResponse,
  HostingProviders,
  PullRequestPayload,
} from './dto/PullRequest.dto';

@Injectable()
export class PullRequestsService {
  constructor(
    @Inject('CodeHostingDrivers') private readonly codeHostingDrivers: CodeHostingDriver[],
  ) {}

  trackPullRequest(payload: PullRequestPayload): Promise<boolean> {
    const driver = this.getCodeHostingDriver(payload.codeHostingProvider);
    return driver.trackPullRequest(payload);
  }

  merge(payload: PullRequestPayload): Promise<boolean> {
    return Promise.resolve(false);
  }

  getTrackedPullRequests(repoName: string): Promise<GetPullRequestsResponse> {
    return Promise.resolve({
      pullRequests: [],
    });
  }

  private getCodeHostingDriver(provider: HostingProviders): CodeHostingDriver {
    return this.codeHostingDrivers.find((driver) =>
      driver.matchProviderCode(provider),
    );
  }
}
