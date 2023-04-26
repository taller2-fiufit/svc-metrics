import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './messageHandler';
import * as AWS from 'aws-sdk';


AWS.config.update({
    region: "us-east-1"/*process.env.AWS_REGION*/,
    accessKeyId: "AKIATKMG2GRWSPTBJS52"/*process.env.ACCESS_KEY_ID*/,
    secretAccessKey: "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" /*process.env.SECRET_ACCESS_KEY*/,
});

@Module({
    imports: [
        SqsModule.register({
            consumers: [
                {
                    name: "MetricsQueue_Development"/*process.env.QUEUE_NAME*/,
                    queueUrl: "https://sqs.us-east-1.amazonaws.com/228452873325/MetricsQueue_Development"/*process.env.QUEUE_URL*/,
                    region: "us-east-1"/*process.env.AWS_REGION*/,
                },
            ],
            producers: [],
        }),
    ],
    controllers: [],
    providers: [MessageHandler],
})
export class ConsumerModule { }