import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743499784417 implements MigrationInterface {
  name = 'Migration1743499784417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_token_entity" DROP COLUMN "expirationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_token_entity" ADD "expirationDate" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_token_entity" DROP COLUMN "expirationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_token_entity" ADD "expirationDate" bigint NOT NULL`,
    );
  }
}
