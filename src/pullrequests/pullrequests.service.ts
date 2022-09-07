import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CodeHostingDriver,
  GetPullRequestsResponse,
  HostingProviders,
} from './dto/PullRequest.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PullRequestPayload } from './entities/PullRequestTrack.entity';

@Injectable()
export class PullRequestsService {
  constructor(
    @Inject('CodeHostingDrivers')
    private readonly codeHostingDrivers: CodeHostingDriver[],
    @InjectRepository(PullRequestPayload)
    private readonly pullRequestRepository: Repository<PullRequestPayload>
  ) {}

  async trackPullRequest(payload: PullRequestPayload): Promise<boolean> {
    const changes = await this.pullRequestRepository.save(payload);
    return !!changes;
  }

  async merge(id: number): Promise<boolean> {
    const details = await this.pullRequestRepository.findOneBy({ id });
    if (!details) {
      throw new BadRequestException('Pull request not found');
    }
    return this.getCodeHostingDriver(details.codeHostingProvider).merge(
      details
    );
  }

  async getTrackedPullRequests(
    repoName: string
  ): Promise<GetPullRequestsResponse> {
    const list = await this.pullRequestRepository.find({
      where: { repositoryName: repoName },
    });
    return this.resolvePullRequestsByDriver(list);
  }

  async resolvePullRequestsByDriver(
    list: PullRequestPayload[]
  ): Promise<GetPullRequestsResponse> {
    const promises = list.map(async (pr) => {
      const payload = await this.getCodeHostingDriver(
        pr.codeHostingProvider
      ).getPulRequestDetails(pr.repositoryName, pr.pullRequestNumber);
      return {
        codeHostingProvider: pr.codeHostingProvider,
        payload,
      };
    });
    const resolved = await Promise.all(promises);
    return {
      pullRequests: resolved,
    };
  }

  private getCodeHostingDriver(provider: HostingProviders): CodeHostingDriver {
    return this.codeHostingDrivers.find((driver) =>
      driver.matchProviderCode(provider)
    );
  }
}
