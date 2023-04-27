import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { MetricsService } from '../metrics/metrics.service';
import { CreateMetricDto } from '../metrics/dtos/create-metric.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MessageHandler {
    constructor(private metricsService: MetricsService) {}
    @SqsMessageHandler('MetricsQueue_Development', false)
    async handleMessage(message: AWS.SQS.Message) {
        const metric = plainToClass(CreateMetricDto, JSON.parse(message.Body));
        this.metricsService.create(metric.service, metric.command, metric.timeStamp);
    }
}