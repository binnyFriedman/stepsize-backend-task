import { Status } from '../../bitbucket';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum HostingProviders {
  GITHUB = 'github',
  GITBUCKET = 'gitbucket',
}

export class PullRequestPayload {
  @IsNotEmpty()
  repositoryName: string;
  @IsNumber()
  pullRequestNumber: number;
  @IsEnum(HostingProviders)
  codeHostingProvider: HostingProviders;
}

interface PullRequest {
  id: number;
  repo: {
    name: string;
  };
  title: string;
  description: string;
  isMergeable: boolean;
  status: Status;
  createdAt: Date;
}

export interface PullRequestResponse {
  codeHostingProvider: HostingProviders;
  payload: PullRequest & Record<string, any>;
}

export interface GetPullRequestsResponse {
  pullRequests: PullRequestResponse[];
}

export interface CodeHostingDriver {
  trackPullRequest(payload: PullRequestPayload): Promise<boolean>;
  merge(payload: PullRequestPayload): Promise<boolean>;
  getTrackedPullRequests(repoName: string): Promise<GetPullRequestsResponse>;
  matchProviderCode(provider: string): boolean;
}
