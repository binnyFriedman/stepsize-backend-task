import {
  CodeHostingDriver,
  GetPullRequestsResponse,
  HostingProviders,
  PullRequestPayload,
} from '../dto/PullRequest.dto';

export class GitHubDriver implements CodeHostingDriver {
  private readonly hostingProvider: HostingProviders = HostingProviders.GITHUB;
  getTrackedPullRequests(repoName: string): Promise<GetPullRequestsResponse> {
    return Promise.resolve(undefined);
  }

  merge(payload: PullRequestPayload): Promise<boolean> {
    return Promise.resolve(false);
  }

  trackPullRequest(payload: PullRequestPayload): Promise<boolean> {
    return Promise.resolve(false);
  }

  matchProviderCode(provider: string): boolean {
    return this.hostingProvider === provider;
  }
}
