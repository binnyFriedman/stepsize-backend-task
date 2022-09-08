import { Module } from '@nestjs/common';
import { PullrequestsModule } from './pullrequests/pullrequests.module';
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
})
export class AppModule {}
