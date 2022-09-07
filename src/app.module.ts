import { Module } from '@nestjs/common';
import { PullrequestsModule } from './pullrequests/pullrequests.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [PullrequestsModule],
})
export class AppModule {}
