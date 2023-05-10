import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Metric } from './metrics.entity';
import { Repository } from 'typeorm';
import { CreateMetricDto } from './dtos/create-metric.dto';

describe('MetricsService', () => {
  let metricsService: MetricsService;
  let repo: Repository<Metric>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: getRepositoryToken(Metric),
          useClass: Repository,
        },
      ],
    }).compile();

    metricsService = module.get<MetricsService>(MetricsService);
    repo = module.get<Repository<Metric>>(getRepositoryToken(Metric));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should save a new metric', () => {
      repo.create = jest.fn().mockReturnValue({
        service: 'test',
        command: 'test',
        timestamp: new Date(),
        attrs: '{}',
      });
      repo.save = jest.fn().mockResolvedValue(null);

      metricsService.create('test', 'test', new Date(), '{}');

      expect(repo.create).toHaveBeenCalledWith({
        service: 'test',
        command: 'test',
        timestamp: expect.any(Date),
        attrs: '{}',
      });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findUsersMetrics', () => {
    it('should return a UsersMetricsDto object', async () => {
      const mockRawMetricsDto = [{ command: 'blockedUsers', count: 1 }];
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockRawMetricsDto),
      };
      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const from = new Date('2022-01-01');
      const to = new Date('2022-01-31');
      const serviceResult = await metricsService.findUsersMetrics(from, to);

      expect(serviceResult).toEqual(expect.any(Object));
      expect(serviceResult.blockedUsers).toBe(1);
    });
  });

  describe('findTrainingsMetrics', () => {
    it('should return a TrainingsMetricsDto object', async () => {
      const mockRawMetricsDto = [{ command: 'trainingCreated', count: 2 }];
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockRawMetricsDto),
      };
      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const from = new Date('2022-01-01');
      const to = new Date('2022-01-31');
      const serviceResult = await metricsService.findTrainingsMetrics(from, to);

      expect(serviceResult).toEqual(expect.any(Object));
      expect(serviceResult.trainingsCreated).toBe(2);
    });
  });

  describe('findMetricsEvents', () => {
    it('should return an array of events with valid parameters', async () => {
      const from = new Date('2022-01-01');
      const to = new Date('2022-12-31');
      const service = 'users';
      const command = 'loginsWithMail';

      const metrics = [
        {
          service: 'users',
          command: 'loginsWithMail',
          timestamp: new Date('2022-01-01'),
          attrs: '{"user": "john.doe@example.com"}',
        },
        {
          service: 'users',
          command: 'loginsWithMail',
          timestamp: new Date('2022-02-01'),
          attrs: '{"user": "jane.doe@example.com"}',
        },
        {
          service: 'users',
          command: 'loginsWithMail',
          timestamp: new Date('2022-03-01'),
          attrs: '{"user": "bob.smith@example.com"}',
        },
      ] as CreateMetricDto[];

      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(metrics),
      } as any);

      const result = await metricsService.findMetricsEvents(
        service,
        command,
        from,
        to,
      );

      expect(result).toHaveLength(3);
      expect(result[0].timestamp).toEqual(metrics[0].timestamp);
      expect(result[0].attrs).toEqual(metrics[0].attrs);
      expect(result[1].timestamp).toEqual(metrics[1].timestamp);
      expect(result[1].attrs).toEqual(metrics[1].attrs);
      expect(result[2].timestamp).toEqual(metrics[2].timestamp);
      expect(result[2].attrs).toEqual(metrics[2].attrs);
    });
  });
});
