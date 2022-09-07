import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { HostingProviders } from '../dto/PullRequest.dto';

@Entity()
export class PullRequestPayload {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { unique: true })
  @IsNotEmpty()
  repositoryName: string;
  @IsNumber()
  @Column('int')
  pullRequestNumber: number;
  @IsEnum(HostingProviders)
  @Column('enum', { enum: HostingProviders })
  codeHostingProvider: HostingProviders;
}
