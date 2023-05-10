import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttrs1683678340330 implements MigrationInterface {
  name = 'AddAttrs1683678340330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "metric" ADD "attrs" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "metric" DROP COLUMN "attrs"`);
  }
}
