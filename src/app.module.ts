import { Module } from '@nestjs/common';
import { PullrequestsModule } from './pullrequests/pullrequests.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PullrequestsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
