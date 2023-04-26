import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class MessageHandler {
    constructor(private messageService: MetricsService) {}
    @SqsMessageHandler('MetricsQueue_Development', false)
    async handleMessage(message: AWS.SQS.Message) {
        /*const obj: any = JSON.parse(message.Body) as {
            message: string;
            date: string;
        };
        const { data } = JSON.parse(obj.Message);*/
        this.messageService.ping();
        console.log(message.Body);

    }
}