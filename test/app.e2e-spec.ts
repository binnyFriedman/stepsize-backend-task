import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  HostingProviders,
  PullRequestResponse,
} from '../src/pullrequests/dto/PullRequest.dto';
import {
  CreatePullRequestPayloadDto,
  PullRequestPayload,
} from '../src/pullrequests/entities/PullRequestTrack.entity';

function is_tracked_pull_request(
  pr_list: PullRequestResponse[],
  pr: CreatePullRequestPayloadDto
) {
  return pr_list.some((tracked_pr) => {
    const { codeHostingProvider, payload } = tracked_pr;
    return (
      codeHostingProvider === pr.codeHostingProvider &&
      payload.repository.name === pr.repositoryName &&
      payload.number === pr.pullRequestNumber
    );
  });
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();
    jest.setTimeout(20000);
  });

  it('should have server running', () => {
    expect(server).toBeDefined();
  });

  describe('(POST) /pullrequest', () => {
    const endpoint = '/pullrequest';
    it('should take a repository name, a pull request number, and code hosting provider (GitHub, or Bitbucket)', async () => {
      const valid_payload: CreatePullRequestPayloadDto = {
        repositoryName: 'test-repo',
        pullRequestNumber: 1,
        codeHostingProvider: HostingProviders.GITHUB,
      };
      await request(app.getHttpServer())
        .post(endpoint)
        .send(valid_payload)
        .expect(201);
      const invalid_payload = {
        ...valid_payload,
      };
      delete invalid_payload.repositoryName;
      await request(app.getHttpServer())
        .post(endpoint)
        .send(invalid_payload)
        .expect(400);
    });
    it('should track a pull request', async () => {
      const payload: Omit<PullRequestPayload, 'id'> = {
        codeHostingProvider: HostingProviders.GITHUB,
        pullRequestNumber: parseInt(process.env.GITHUB_OPEN_PR_NUMBER || '1'),
        repositoryName: process.env.GITHUB_OPEN_PR_REPO,
      };
      await request(server).post(endpoint).send(payload).expect(201);
      //check if the pull request is tracked
      const tracked_pull_requests_payload = await request(app.getHttpServer())
        .get(`${endpoint}?repositoryName=${payload.repositoryName}`)
        .expect(200);
      const { pullRequests } = tracked_pull_requests_payload.body;
      expect(is_tracked_pull_request(pullRequests, payload)).toBeTruthy();
    });
  });

  describe('(GET) /pullrequest/?repositoryName=:repoName', () => {
    const endpoint = '/pullrequest';
    async function track_pull_requests(
      amount: number,
      repoName: string,
      hostingProvider: HostingProviders
    ) {
      const pr_numbers = process.env.GITHUB_REPO_PR_NUMBERS?.split(',');
      for (let i = 0; i < amount; i++) {
        const payload: CreatePullRequestPayloadDto = {
          codeHostingProvider: hostingProvider,
          pullRequestNumber: parseInt(
            pr_numbers[Math.floor(Math.random() * pr_numbers.length)]
          ),
          repositoryName: repoName,
        };
        await request(server).post(endpoint).send(payload).expect(201);
      }
    }
    it('should return a list of pull requests for a given repository', async () => {
      const providers = [
        {
          provider: HostingProviders.GITHUB,
          repo: process.env.GITHUB_REPO_WITH_MANY_PRS,
        },
        { provider: HostingProviders.BITBUCKET, repo: 'test-repo' },
      ];

      for (const providerObj of providers) {
        //first track a few pull requests
        const NUM_PULL_REQUESTS = 3;
        const repoName = providerObj.repo;
        await track_pull_requests(
          NUM_PULL_REQUESTS,
          repoName,
          providerObj.provider
        );
        const req = await request(server).get(
          `${endpoint}?repositoryName=${repoName}`
        );

        expect(req.status).toBe(200);
        expect(req.body).toBeDefined();
        expect(req.body.pullRequests).toBeDefined();
        expect(req.body.pullRequests).toBeInstanceOf(Array);
        expect(req.body.pullRequests.length).toBe(NUM_PULL_REQUESTS);
      }
    });
  });

  describe('(POST) /pullrequest/:id/merge', () => {
    it('should merge a pull request if mergeable', async () => {
      const mergeable_pr: CreatePullRequestPayloadDto = {
        codeHostingProvider: HostingProviders.GITHUB,
        pullRequestNumber: parseInt(process.env.GITHUB_OPEN_PR_NUMBER),
        repositoryName: process.env.GITHUB_OPEN_PR_REPO,
      };
      const mergeable_pr_res = await request(server)
        .post('/pullrequest')
        .send(mergeable_pr)
        .expect(201);
      const mergeable_pr_id = mergeable_pr_res.body.id;

      //then merge it
      await request(server)
        .post(`/pullrequest/${mergeable_pr_id}/merge`)
        .expect(201);
    });
    it('should not merge a pull request if not mergeable', async () => {
      const unmanageable_pr: CreatePullRequestPayloadDto = {
        codeHostingProvider: HostingProviders.GITHUB,
        pullRequestNumber: parseInt(process.env.GITHUB_CLOSED_PR_NUMBER),
        repositoryName: process.env.GITHUB_CLOSED_PR_REPO,
      };
      const unmanageable_pr_res = await request(server)
        .post('/pullrequest')
        .send(unmanageable_pr)
        .expect(201);
      const unmanageable_pr_id = unmanageable_pr_res.body.id;
      await request(server)
        .post(`/pullrequest/${unmanageable_pr_id}/merge`)
        .expect(500)
        .expect(false);
    });
  });
});
