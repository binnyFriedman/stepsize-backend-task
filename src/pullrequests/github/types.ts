interface PullRequest {
  id: number;
  title: string;
  description: string;
  isMergeable: boolean;
  createdAt: Date;
}