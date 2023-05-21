import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrainingsMetricsDto {
  @Expose()
  @ApiProperty()
  trainingsCreated: number;

  @Expose()
  @ApiProperty()
  trainingsFavorited: number;
}
