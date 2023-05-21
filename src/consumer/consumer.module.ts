import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './messageHandler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { MetricsService } from '../metrics/metrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from '../metrics/metrics.entity';

const factory = () => {
  const configService = new ConfigService();

  const QUEUE_NAME = configService.get('QUEUE_NAME');
  const QUEUE_URL = configService.get('QUEUE_URL');
  const AWS_REGION = configService.get('AWS_REGION');

  if (!QUEUE_NAME || !QUEUE_URL || !AWS_REGION) {
    return {};
  }
  return {
    consumers: [
      {
        name: QUEUE_NAME,
        queueUrl: QUEUE_URL,
        region: AWS_REGION,
      },
    ],
  };
};

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Metric]),
    SqsModule.registerAsync({
      useFactory: factory,
    }),
  ],
  controllers: [],
  providers: [MessageHandler, MetricsService],
})
export class ConsumerModule {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const AWS_REGION = this.configService.get('AWS_REGION');
    const AWS_ACCESS_KEY_ID = this.configService.get('AWS_REGION');
    const AWS_SECRET_ACCESS_KEY = this.configService.get('AWS_REGION');

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      return;
    }

    const myConfig = new AWS.Config();

    myConfig.update({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  }
}
