import { PullRequestIdentifier } from './types';
import { mockPullRequestGenerator } from './mockPullRequestGenerator';
import { CodeHostingDriver } from '../dto/PullRequest.dto';
import { PullRequestPayload } from '../entities/PullRequestTrack.entity';
import { PullRequest } from '../dto/PullRequest.dto';

export class MockBitbucketClient implements CodeHostingDriver {
  private readonly providerCode = 'bitbucket';
  static async isPullRequestMergeable(
    identifier: PullRequestIdentifier
  ): Promise<boolean> {
    return Promise.resolve(Math.random() < 0.75);
  }

  static async mergePullRequest(
    identifier: PullRequestIdentifier
  ): Promise<void> {
    return Promise.resolve();
  }

  static async getPullRequest(
    identifier: PullRequestIdentifier
  ): Promise<PullRequest> {
    return Promise.resolve(mockPullRequestGenerator(identifier));
  }

  getPulRequestDetails(repo: string, id: number): Promise<PullRequest> {
    return MockBitbucketClient.getPullRequest({
      pullRequestId: id,
      repoName: repo,
    });
  }

  matchProviderCode(provider: string): boolean {
    return this.providerCode === provider;
  }

  async merge(payload: PullRequestPayload): Promise<boolean> {
    const isMergeable = MockBitbucketClient.isPullRequestMergeable({
      pullRequestId: payload.pullRequestNumber,
      repoName: payload.repositoryName,
    });
    if (isMergeable) {
      await MockBitbucketClient.mergePullRequest({
        pullRequestId: payload.pullRequestNumber,
        repoName: payload.repositoryName,
      });
    }
    return isMergeable;
  }
}
