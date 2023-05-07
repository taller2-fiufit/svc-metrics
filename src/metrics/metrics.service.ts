import { Injectable } from '@nestjs/common';
import { Metric } from './metrics.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersMetricsDto } from './dtos/users-metrics.dto';
import { TrainingsMetricsDto } from './dtos/trainings-metrics.dto';
import { RawMetricsDto } from './dtos/raw-metrics.dto';
import { isValid } from 'date-fns';

@Injectable()
export class MetricsService {
  constructor(@InjectRepository(Metric) private repo: Repository<Metric>) {}

  create(service: string, command: string, timestamp: Date) {
    const metric = this.repo.create({ service, command, timestamp });
    this.repo.save(metric);
  }

  async findUsersMetrics(from: Date, to: Date) {
    const validFrom = isValid(from) ? from : new Date('1970-01-01');
    const validTo = isValid(to) ? to : new Date('9999-01-01');
    const usersMetricsRaw: RawMetricsDto[] = await this.repo
      .createQueryBuilder()
      .select('command')
      .addSelect("COUNT('commands')")
      .where('service = :service', { service: 'users' })
      .andWhere('timestamp <= :toTimestamp', { toTimestamp: validTo })
      .andWhere('timestamp >= :fromTimestamp', { fromTimestamp: validFrom })
      .groupBy('command')
      .execute();
    return this.mapToUsersDto(usersMetricsRaw);
  }

  async findTrainingsMetrics(from: Date, to: Date) {
    const validFrom = isValid(from) ? from : new Date('1970-01-01');
    const validTo = isValid(to) ? to : new Date('9999-01-01');
    const trainingsMetricsRaw: RawMetricsDto[] = await this.repo
      .createQueryBuilder()
      .select('command')
      .addSelect("COUNT('commands')")
      .where('service = :service', { service: 'trainings' })
      .andWhere('timestamp <= :toTimestamp', { toTimestamp: validTo })
      .andWhere('timestamp >= :fromTimestamp', { fromTimestamp: validFrom })
      .groupBy('command')
      .execute();
    return this.mapToTrainingsDto(trainingsMetricsRaw);
  }

  private mapToUsersDto(usersMetricsRaw: RawMetricsDto[]): UsersMetricsDto {
    const usersMetricsDto = new UsersMetricsDto();
    usersMetricsDto.blockedUsers =
      usersMetricsRaw.find((e) => e.command == 'blockedUsers')?.count || 0;
    usersMetricsDto.loginsWithFederatedId =
      usersMetricsRaw.find((e) => e.command == 'loginsWithFederatedId')
        ?.count || 0;
    usersMetricsDto.loginsWithMail =
      usersMetricsRaw.find((e) => e.command == 'loginsWithMail')?.count || 0;
    usersMetricsDto.signinsWithFederatedId =
      usersMetricsRaw.find((e) => e.command == 'signinsWithFederatedId')
        ?.count || 0;
    usersMetricsDto.signinsWithMail =
      usersMetricsRaw.find((e) => e.command == 'signinsWithMail')?.count || 0;
    return usersMetricsDto;
  }

  private mapToTrainingsDto(
    usersMetricsRaw: RawMetricsDto[],
  ): TrainingsMetricsDto {
    const trainingsMetricsDto = new TrainingsMetricsDto();
    trainingsMetricsDto.trainingsCreated =
      usersMetricsRaw.find((e) => e.command == 'trainingCreated')?.count || 0;
    return trainingsMetricsDto;
  }
}
