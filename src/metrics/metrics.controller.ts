import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { UsersMetricsDto } from './dtos/users-metrics.dto';
import { TrainingsMetricsDto } from './dtos/trainings-metrics.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('users')
  @Serialize(UsersMetricsDto)
  findUsersMetrics(@Query('from') from: Date, @Query('to') to: Date) {
    return this.metricsService.findUsersMetrics(from, to);
  }

  @Get('trainings')
  @Serialize(TrainingsMetricsDto)
  findTrainingsMetrics(@Query('from') from: Date, @Query('to') to: Date) {
    return this.metricsService.findTrainingsMetrics(from, to);
  }
}
