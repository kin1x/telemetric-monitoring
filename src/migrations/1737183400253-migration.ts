import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737183400253 implements MigrationInterface {
  name = 'Migration1737183400253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "log_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "key" text NOT NULL, "value" text NOT NULL, CONSTRAINT "PK_5e18fff6d62959da212066f2882" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2dd2a8de48b079d39189920999" ON "log_entity" ("order") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2dd2a8de48b079d39189920999"`,
    );
    await queryRunner.query(`DROP TABLE "log_entity"`);
  }
}
