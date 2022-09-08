import { PullRequestPayload } from '../entities/PullRequestTrack.entity';

export enum HostingProviders {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
}

export type Status = 'OPEN' | 'CLOSED' | 'MERGED';

export interface PullRequest {
  id: number;
  repository: {
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
  payload: Record<string, any>;
}

export interface GetPullRequestsResponse {
  pullRequests: PullRequestResponse[];
}

export interface CodeHostingDriver {
  merge(payload: PullRequestPayload): Promise<boolean>;
  getPulRequestDetails(repo: string, id: number): Promise<PullRequest>;
  matchProviderCode(provider: string): boolean;
}
