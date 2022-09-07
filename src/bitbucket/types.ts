export type Status = 'OPEN' | 'CLOSED' | 'MERGED';
export const Statuses: Status[] = ['OPEN', 'CLOSED', 'MERGED'];

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

export interface PullRequestIdentifier {
  repoName: string;
  pullRequestId: number;
  // In real life, there would be an identifier for the account / workspace
}
