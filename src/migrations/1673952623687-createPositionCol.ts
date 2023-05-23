import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPositionCol1673952623687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE CHAMPRATE ADD position VARCHAR(20) DEFAULT 'old'`,
    );
    await queryRunner.query(
      `ALTER TABLE CHAMPSPELL ADD position VARCHAR(20) DEFAULT 'old'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE CHAMPRATE DROP COLUMN position`);
    await queryRunner.query(`ALTER TABLE CHAMPSPELL DROP COLUMN position`);
  }
}
