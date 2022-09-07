import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  HostingProviders,
  PullRequestResponse,
  PullRequestPayload,
} from '../src/pullrequests/dto/PullRequest.dto';

function is_tracked_pull_request(
  pr_list: PullRequestResponse[],
  pr: PullRequestPayload,
) {
  return pr_list.some((tracked_pr) => {
    return (
      tracked_pr.payload.id === pr.pullRequestNumber &&
      tracked_pr.payload.repository.name === pr.repositoryName &&
      tracked_pr.codeHostingProvider === pr.codeHostingProvider
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
  });

  it('should have server running', () => {
    expect(server).toBeDefined();
  });

  it('(GET) /', () => {
    return request(server).get('/').expect(200).expect('Hello World!');
  });

  describe('/pullrequest (POST)', () => {
    const endpoint = '/pullrequest';
    it('should take a repository name, a pull request number, and code hosting provider (GitHub, or Bitbucket)', async () => {
      const valid_payload: PullRequestPayload = {
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
      const payload: PullRequestPayload = {
        codeHostingProvider: HostingProviders.GITHUB,
        pullRequestNumber: 18,
        repositoryName: 'cannabis-amplified',
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
  describe('GET /pullrequest/?repositoryName=:repoName', () => {
    const endpoint = '/pullrequest';
    it('should return a list of pull requests for a given repository', async () => {
      const server = app.getHttpServer();
      const req = await request(server).get(`${endpoint}?repositoryName=edi`);
      console.log(req.body);
      expect(req.status).toBe(200);
      expect(req.body).toBeDefined();
      expect(req.body.pullRequests).toBeDefined();
      expect(req.body.pullRequests).toBeInstanceOf(Array);
      expect(req.body.pullRequests.length).toBeGreaterThan(0);
    });
  });
});
