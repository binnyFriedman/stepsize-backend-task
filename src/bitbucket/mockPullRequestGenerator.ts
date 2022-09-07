import { PullRequest, PullRequestIdentifier, Statuses } from './types';
import assert from 'assert';

const randomPickOne = <T>(options: Array<T>): T => {
  const optionsCount = options.length;
  const randomIndex = Math.floor(Math.random() * optionsCount);
  return options[randomIndex];
};

export function mockPullRequestGenerator(
  identifier: PullRequestIdentifier,
): PullRequest {
  assert(
    typeof identifier.pullRequestId === 'number',
    'PullRequestId needs to be a number',
  );

  const titleOptions = [
    'Fix: Calculate ascent speed correctly for Boeing 737 Max',
    'Feature: Improve CO2 emission calculations for Volkvagen Polo',
    'Bug: Properly report COVID infection cases',
  ];
  const selectedTitle =
    titleOptions[identifier.pullRequestId % titleOptions.length];

  const status = randomPickOne(Statuses);
  const isMergeable = status === 'OPEN' && Math.random() < 0.75;

  return {
    id: identifier.pullRequestId,
    repository: {
      name: identifier.repoName,
    },
    title: selectedTitle,
    description: '',
    createdAt: new Date(),
    status,
    isMergeable,
  };
}
