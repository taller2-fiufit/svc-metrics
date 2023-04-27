import { Injectable } from '@nestjs/common';
import { Metric } from './metrics.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetricsService {
    constructor(@InjectRepository(Metric) private repo: Repository<Metric>) {}

    create(service: string, command: string, timeStamp: Date) {
        const metric = this.repo.create({service, command, timeStamp})
        this.repo.save(metric);
    }
}
