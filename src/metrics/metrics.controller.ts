import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { UsersMetricsDto } from './dtos/users-metrics.dto';
import { TrainingsMetricsDto } from './dtos/trainings-metrics.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('users')
  @Serialize(UsersMetricsDto)
  findUsersMetrics() {
    return this.metricsService.findUsersMetrics();
  }

  @Get('trainings')
  @Serialize(TrainingsMetricsDto)
  findTrainingsMetrics() {
    return this.metricsService.findTrainingsMetrics();
  }
}
