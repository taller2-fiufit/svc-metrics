import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as request from 'supertest';
import { Repository } from 'typeorm';

import { Metric } from '../src/metrics/metrics.entity';
import { AppModule } from '../src/app.module';
import { UsersMetricsDto } from '../src/metrics/dtos/users-metrics.dto';
import { CreateMetricDto } from '../src/metrics/dtos/create-metric.dto';
import { TrainingsMetricsDto } from '../src/metrics/dtos/trainings-metrics.dto';

describe('Sistema de Métricas', () => {
  let app: INestApplication;
  let metricsRepository: Repository<Metric>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    metricsRepository = app.get(getRepositoryToken(Metric));
    await metricsRepository.delete({});
    await app.init();
  });

  it('las métricas inician en 0', async () => {
    await request(app.getHttpServer())
      .get('/metrics/users')
      .expect(200)
      .then((res) => {
        const usersMetrics: UsersMetricsDto = res.body;
        expect(usersMetrics.blockedUsers).toEqual(0);
        expect(usersMetrics.loginsWithFederatedId).toEqual(0);
        expect(usersMetrics.loginsWithMail).toEqual(0);
        expect(usersMetrics.signinsWithFederatedId).toEqual(0);
        expect(usersMetrics.signinsWithMail).toEqual(0);
      });

    await request(app.getHttpServer())
      .get('/metrics/trainings')
      .expect(200)
      .then((res) => {
        const trainingsMetrics: TrainingsMetricsDto = res.body;
        expect(trainingsMetrics.trainingsCreated).toEqual(0);
        expect(trainingsMetrics.trainingsFavorited).toEqual(0);
      });
  });

  it('las métricas inician en 0', async () => {
    const metric = metricsRepository.create({
      timestamp: new Date().toISOString(),
      service: 'trainings',
      command: 'trainingCreated',
      attrs: '{}',
    });

    await request(app.getHttpServer())
      .get(`/metrics/trainings/events/${metric.command}`)
      .query({ from: metric.timestamp, to: metric.timestamp })
      .expect(200)
      .then((res) => {
        const trainingsMetrics: CreateMetricDto[] = res.body;
        expect(trainingsMetrics.length).toEqual(1);
        const expectedMetric = { attrs: JSON.parse(metric.attrs), ...metric };
        expect(trainingsMetrics).toEqual([expectedMetric]);
      });
  });
});
