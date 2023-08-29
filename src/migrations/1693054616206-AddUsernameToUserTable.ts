import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUserTable1693054616206 implements MigrationInterface {
  name = 'AddUsernameToUserTable1693054616206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
  }
}
