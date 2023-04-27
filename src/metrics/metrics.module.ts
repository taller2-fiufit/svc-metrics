import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { Metric } from './metrics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '6000s' },
        };
      },
    }),
  ],
  providers: [MetricsService],
  controllers: [MetricsController]
})
export class MetricsModule {}
