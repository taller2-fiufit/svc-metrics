import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { MetricsService } from '../metrics/metrics.service';
import { CreateMetricDto } from '../metrics/dtos/create-metric.dto';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();
const queueName = configService.get<string>('QUEUE_NAME');

@Injectable()
export class MessageHandler {
    constructor(private metricsService: MetricsService) {}
    @SqsMessageHandler(queueName, false)
    async handleMessage(message: AWS.SQS.Message) {
        let rawMessage = JSON.parse(message.Body);
        const metric = this.parseMetric(rawMessage)
        this.metricsService.create(metric.service, metric.command, metric.timeStamp);
    }

    private parseMetric(message: any): CreateMetricDto {
      message.timeStamp = new Date(message.timeStamp).toISOString();
      return plainToClass(CreateMetricDto, message);
    }
}