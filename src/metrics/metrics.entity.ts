import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @AfterInsert()
  logInsert() {
    console.log('Insertada Metrica:', this);
  }
}
