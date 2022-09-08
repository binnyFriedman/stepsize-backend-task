import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GetPullRequestsResponse } from './dto/PullRequest.dto';
import { PullRequestsService } from './pullrequests.service';
import {
  CreatePullRequestPayloadDto,
  PullRequestPayload,
} from './entities/PullRequestTrack.entity';

@Controller('pullrequest')
export class PullrequestsController {
  constructor(private prService: PullRequestsService) {}
  @Post()
  trackPullRequest(
    @Body() payload: CreatePullRequestPayloadDto
  ): Promise<PullRequestPayload> {
    return this.prService.trackPullRequest(payload);
  }

  @Get()
  getTrackedPullRequests(
    @Query('repositoryName') repoName: string
  ): Promise<GetPullRequestsResponse> {
    if (!repoName) {
      throw new BadRequestException('Repository name is required');
    }
    return this.prService.getTrackedPullRequests(repoName);
  }

  @Post('/:id/merge')
  merge(@Param('id') id: number): Promise<boolean> {
    return this.prService.merge(id);
  }
}
