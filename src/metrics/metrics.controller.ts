import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
    constructor (private metricsService: MetricsService) { }

    @Get('users')
    findUsersMetrics() {
        return this.metricsService.findUsersMetrics();
    }
}
