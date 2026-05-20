import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1779237793695 implements MigrationInterface {
  name = 'Migration1779237793695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_events_eventtype_enum" AS ENUM('CREATED', 'TRANSITIONED', 'UPDATED', 'ASSIGNED', 'TIME_LOGGED', 'DELETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticketId" uuid NOT NULL, "ticketTitle" character varying NOT NULL, "userId" uuid NOT NULL, "userUsername" character varying NOT NULL, "eventType" "public"."ticket_events_eventtype_enum" NOT NULL, "fromStatus" character varying, "toStatus" character varying, "comment" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d61d07653b492eca67f9bad8ec2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "token_hash" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "expires_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN "token_hash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP TABLE "ticket_events"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_events_eventtype_enum"`,
    );
  }
}
