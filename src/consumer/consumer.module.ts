import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './messageHandler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { MetricsService } from 'src/metrics/metrics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from '../metrics/metrics.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Metric]),
        SqsModule.registerAsync({
            useFactory: () => {
                const configService = new ConfigService();
                return {
                    consumers: [{
                        name: configService.get('QUEUE_NAME'),
                        queueUrl: configService.get('QUEUE_URL'),
                        region: configService.get('AWS_REGION')
                    }],
                    producers: []
                };
            }
        }),
    ],
    controllers: [],
    providers: [MessageHandler, MetricsService]
})
export class ConsumerModule {
    constructor(private configService: ConfigService) {}
    onModuleInit() {
        var myConfig = new AWS.Config();
        myConfig.update({
            region:  this.configService.get('AWS_REGION'),
            accessKeyId: this.configService.get('ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
        });
    }
}