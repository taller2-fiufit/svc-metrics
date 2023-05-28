import { Controller, Get, Query, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { UsersMetricsDto } from './dtos/users-metrics.dto';
import { TrainingsMetricsDto } from './dtos/trainings-metrics.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('users')
  @Serialize(UsersMetricsDto)
  findUsersMetrics(@Query('from') from: Date, @Query('to') to: Date) {
    return this.metricsService.findUsersMetrics(from, to);
  }

  @Get('users/events/:command')
  findUsersEvents(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Param('command') command: string,
  ) {
    return this.metricsService.findMetricsEvents('users', command, from, to);
  }

  @Get('trainings')
  @Serialize(TrainingsMetricsDto)
  findTrainingsMetrics(@Query('from') from: Date, @Query('to') to: Date) {
    return this.metricsService.findTrainingsMetrics(from, to);
  }

  @Get('trainings/events/:command')
  findTrainingsEvents(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Param('command') command: string,
  ) {
    return this.metricsService.findMetricsEvents(
      'trainings',
      command,
      from,
      to,
    );
  }
}
