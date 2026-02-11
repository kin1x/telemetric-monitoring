import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741538821928 implements MigrationInterface {
  name = 'Migration1741538821928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expirationDate" TIMESTAMP NOT NULL, CONSTRAINT "UQ_245e67a04f1dfb28e46abb3c29f" UNIQUE ("token"), CONSTRAINT "PK_7e4c5cad633450119e812010992" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_token_entity"`);
  }
}
