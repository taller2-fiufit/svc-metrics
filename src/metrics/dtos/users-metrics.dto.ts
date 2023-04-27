import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UsersMetricsDto {
  @Expose()
  @ApiProperty()
  signinsWithMail: number;

  @Expose()
  @ApiProperty()
  signinsWithFederatedId: number;

  @Expose()
  @ApiProperty()
  loginsWithMail: number;

  @Expose()
  @ApiProperty()
  loginsWithFederatedId: number;

  @Expose()
  @ApiProperty()
  blockedUsers: number;
}
