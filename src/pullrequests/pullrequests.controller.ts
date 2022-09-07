import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  GetPullRequestsResponse,
  PullRequestPayload,
} from './dto/PullRequest.dto';
import { PullRequestsService } from './pullrequests.service';

@Controller('pullrequest')
export class PullrequestsController {
  constructor(private prService: PullRequestsService) {}
  @Post()
  trackPullRequest(@Body() payload: PullRequestPayload): Promise<boolean> {
    return this.prService.trackPullRequest(payload);
  }

  @Get()
  getTrackedPullRequests(
    @Query('repositoryName') repoName: string,
  ): Promise<GetPullRequestsResponse> {
    if (!repoName) {
      throw new BadRequestException('Repository name is required');
    }
    return this.prService.getTrackedPullRequests(repoName);
  }

  @Post('/:id/merge')
  merge(@Param('id') id: string, @Body() payload: PullRequestPayload) {
    return this.prService.merge(payload);
  }
}
