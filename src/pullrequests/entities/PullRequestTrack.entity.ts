import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { HostingProviders } from '../dto/PullRequest.dto';

@Entity()
export class PullRequestPayload {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar')
  @IsNotEmpty()
  repositoryName: string;
  @IsNumber()
  @Column('int')
  pullRequestNumber: number;
  @IsEnum(HostingProviders)
  @Column('varchar')
  codeHostingProvider: HostingProviders;
}

export class CreatePullRequestPayloadDto {
  @IsNotEmpty()
  repositoryName: string;
  @IsNumber()
  pullRequestNumber: number;
  @IsEnum(HostingProviders)
  codeHostingProvider: HostingProviders;
}
