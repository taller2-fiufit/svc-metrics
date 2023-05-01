import { Injectable } from '@nestjs/common';
import { Metric } from './metrics.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersMetricsDto } from './dtos/users-metrics.dto';
import { TrainingsMetricsDto } from './dtos/trainings-metrics.dto';
import { RawMetricsDto } from './dtos/raw-metrics.dto';

@Injectable()
export class MetricsService {
  constructor(@InjectRepository(Metric) private repo: Repository<Metric>) {}

  create(service: string, command: string, timeStamp: Date) {
    const metric = this.repo.create({ service, command, timeStamp });
    this.repo.save(metric);
  }

  async findUsersMetrics() {
    const usersMetricsRaw: RawMetricsDto[] = await this.repo
      .createQueryBuilder()
      .select('command')
      .addSelect("COUNT('commands')")
      .where('service = :service', { service: 'users' })
      .groupBy('command')
      .execute();
    return this.mapToUsersDto(usersMetricsRaw);
  }

  async findTrainingsMetrics() {
    const trainingsMetricsRaw: RawMetricsDto[] = await this.repo
      .createQueryBuilder()
      .select('command')
      .addSelect("COUNT('commands')")
      .where('service = :service', { service: 'trainings' })
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

  private mapToTrainingsDto(usersMetricsRaw: RawMetricsDto[]): TrainingsMetricsDto {
    const trainingsMetricsDto = new TrainingsMetricsDto();
    trainingsMetricsDto.trainingsCreated =
      usersMetricsRaw.find((e) => e.command == 'trainingCreated')?.count || 0;
    return trainingsMetricsDto;
  }
}
