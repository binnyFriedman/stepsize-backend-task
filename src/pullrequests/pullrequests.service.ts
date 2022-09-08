import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ICodeHostingProvider,
  GetPullRequestsResponse,
  HostingProviders,
} from './dto/PullRequest.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePullRequestPayloadDto,
  PullRequestPayload,
} from './entities/PullRequestTrack.entity';

@Injectable()
export class PullRequestsService {
  constructor(
    @Inject('CodeHostingDrivers')
    private readonly codeHostingDrivers: ICodeHostingProvider[],
    @InjectRepository(PullRequestPayload)
    private readonly pullRequestRepository: Repository<PullRequestPayload>
  ) {}

  async trackPullRequest(
    payload: CreatePullRequestPayloadDto
  ): Promise<PullRequestPayload> {
    const created = await this.pullRequestRepository.create(payload);
    return await this.pullRequestRepository.save(created);
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

  private getCodeHostingDriver(
    provider: HostingProviders
  ): ICodeHostingProvider {
    return this.codeHostingDrivers.find((driver) =>
      driver.matchProviderCode(provider)
    );
  }
}
