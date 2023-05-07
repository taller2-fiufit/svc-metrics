import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1682606563487 implements MigrationInterface {
  name = 'InitialSchema1682606563487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "metric" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "service" character varying NOT NULL, "command" character varying NOT NULL, CONSTRAINT "PK_7d24c075ea2926dd32bd1c534ce" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "metric"`);
  }
}
