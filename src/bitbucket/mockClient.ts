import { PullRequest, PullRequestIdentifier } from './types';
import { mockPullRequestGenerator } from './mockPullRequestGenerator';

export class MockBitbucketClient {
  static async isPullRequestMergeable(
    identifier: PullRequestIdentifier,
  ): Promise<boolean> {
    return Promise.resolve(Math.random() < 0.75);
  }

  static async mergePullRequest(
    identifier: PullRequestIdentifier,
  ): Promise<void> {
    return Promise.resolve();
  }

  static async getPullRequest(
    identifier: PullRequestIdentifier,
  ): Promise<PullRequest> {
    return Promise.resolve(mockPullRequestGenerator(identifier));
  }
}
