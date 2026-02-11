import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1746278869671 implements MigrationInterface {
  name = 'InitTables1746278869671'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" text NOT NULL, "userId" text, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" text NOT NULL, "message" text NOT NULL, "level" text NOT NULL, "factory" text NOT NULL, "service" text NOT NULL, "environment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL DEFAULT '0', "tokenId" uuid, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_e725378ffb8e3b9fce368786e2" ON "logs" ("order", "id") `);
    await queryRunner.query(`CREATE TABLE "log_traces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "file" text NOT NULL, "line" integer NOT NULL, "position" integer NOT NULL, "logId" uuid, CONSTRAINT "PK_b9a3b0c0e8c92be61d9bbe6d5bd" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "endpoint_metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying NOT NULL, "path" character varying NOT NULL, "statusCode" integer NOT NULL, "duration" double precision NOT NULL, "userId" character varying, "ip" character varying, CONSTRAINT "PK_be6d659bdf4525887059ba16614" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "db_metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "query" text NOT NULL, "duration" double precision NOT NULL, "entity" text NOT NULL, "operation" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "endpoint" text, CONSTRAINT "PK_29812caa2b8e5c8a0c29cfe678a" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "service_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expirationDate" TIMESTAMP, CONSTRAINT "UQ_245e67a04f1dfb28e46abb3c29f" UNIQUE ("token"), CONSTRAINT "PK_7e4c5cad633450119e812010992" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "permission_token" ("permissionId" uuid NOT NULL, "tokenId" uuid NOT NULL, CONSTRAINT "PK_4297a9343e556be98860bd8cd0a" PRIMARY KEY ("permissionId", "tokenId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_3678019a21a5e19776af13bbd6" ON "permission_token" ("permissionId") `);
    await queryRunner.query(`CREATE INDEX "IDX_388215f79e393d6912a7126800" ON "permission_token" ("tokenId") `);
    await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_d46f362bf30f972098d350d65cf" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "log_traces" ADD CONSTRAINT "FK_93f470cc244376e19e3837fd7db" FOREIGN KEY ("logId") REFERENCES "logs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "permission_token" ADD CONSTRAINT "FK_3678019a21a5e19776af13bbd63" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "permission_token" ADD CONSTRAINT "FK_388215f79e393d6912a7126800c" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permission_token" DROP CONSTRAINT "FK_388215f79e393d6912a7126800c"`);
    await queryRunner.query(`ALTER TABLE "permission_token" DROP CONSTRAINT "FK_3678019a21a5e19776af13bbd63"`);
    await queryRunner.query(`ALTER TABLE "log_traces" DROP CONSTRAINT "FK_93f470cc244376e19e3837fd7db"`);
    await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_d46f362bf30f972098d350d65cf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_388215f79e393d6912a7126800"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3678019a21a5e19776af13bbd6"`);
    await queryRunner.query(`DROP TABLE "permission_token"`);
    await queryRunner.query(`DROP TABLE "service_token_entity"`);
    await queryRunner.query(`DROP TABLE "db_metrics"`);
    await queryRunner.query(`DROP TABLE "endpoint_metrics"`);
    await queryRunner.query(`DROP TABLE "log_traces"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e725378ffb8e3b9fce368786e2"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}