import {
  CodeHostingDriver,
  HostingProviders,
  PullRequest,
} from '../dto/PullRequest.dto';
import { Octokit } from 'octokit';
import { PullRequestPayload } from '../entities/PullRequestTrack.entity';
import { BadRequestException } from '@nestjs/common';

function getOctokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

export class GitHubDriver implements CodeHostingDriver {
  private readonly hostingProvider: HostingProviders = HostingProviders.GITHUB;
  private readonly OWNER = process.env.GITHUB_OWNER;

  async merge(payload: PullRequestPayload): Promise<boolean> {
    const octokit = getOctokit();
    const is_mergeable = await this.isPullRequestMergeable(payload);
    if (!is_mergeable) throw new BadRequestException('The pr is not mergeable');
    const resp = await octokit.rest.pulls.merge({
      repo: payload.repositoryName,
      pull_number: payload.pullRequestNumber,
      owner: this.OWNER,
    });
    return resp.status === 200;
  }
  private async isPullRequestMergeable(payload: PullRequestPayload) {
    const octokit = getOctokit();
    const resp = await octokit.rest.pulls.checkIfMerged({
      repo: payload.repositoryName,
      pull_number: payload.pullRequestNumber,
      owner: this.OWNER,
    });
    return resp.status !== 204;
  }

  matchProviderCode(provider: string): boolean {
    return this.hostingProvider === provider;
  }

  async getPulRequestDetails(repo: string, id: number): Promise<PullRequest> {
    const octokit = getOctokit();
    const pr = await octokit.rest.pulls.get({
      owner: this.OWNER,
      repo,
      pull_number: id,
    });
    if (pr.status !== 200) {
      throw new Error('Unable to fetch pull request details');
    }
    return GitHubDriver.mapPullRequest(pr.data);
  }

  private static mapPullRequest(pr: any): PullRequest {
    return {
      createdAt: pr.created_at,
      description: pr.body,
      id: pr.id,
      isMergeable: false,
      repository: { name: pr.base.repo.name },
      status: undefined,
      title: pr.title,
      ...pr,
    };
  }
}
