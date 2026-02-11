import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1746000538174 implements MigrationInterface {
    name = 'Migration1746000538174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log_traces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "file" text NOT NULL, "line" integer NOT NULL, "position" integer NOT NULL, "logId" uuid, CONSTRAINT "PK_b9a3b0c0e8c92be61d9bbe6d5bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" text NOT NULL, "message" text NOT NULL, "factory" text NOT NULL, "service" text NOT NULL, "environment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "sessionToken" text, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e725378ffb8e3b9fce368786e2" ON "logs" ("order", "id") `);
        await queryRunner.query(`CREATE TABLE "endpoint_metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying NOT NULL, "path" character varying NOT NULL, "statusCode" integer NOT NULL, "duration" double precision NOT NULL, "userId" character varying, "ip" character varying, CONSTRAINT "PK_be6d659bdf4525887059ba16614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "db_metrics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "query" text NOT NULL, "duration" double precision NOT NULL, "entity" text NOT NULL, "operation" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "endpoint" text, CONSTRAINT "PK_29812caa2b8e5c8a0c29cfe678a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_token_entity" ALTER COLUMN "expirationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "log_traces" ADD CONSTRAINT "FK_93f470cc244376e19e3837fd7db" FOREIGN KEY ("logId") REFERENCES "logs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log_traces" DROP CONSTRAINT "FK_93f470cc244376e19e3837fd7db"`);
        await queryRunner.query(`ALTER TABLE "service_token_entity" ALTER COLUMN "expirationDate" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "db_metrics"`);
        await queryRunner.query(`DROP TABLE "endpoint_metrics"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e725378ffb8e3b9fce368786e2"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "log_traces"`);
    }

}
