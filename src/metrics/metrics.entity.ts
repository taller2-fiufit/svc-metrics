import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  service: string;

  @Column()
  command: string;

  @Column()
  attrs: string;
}
