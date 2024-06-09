import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

const TABLE = new Table({
  name: 'tracks',
  columns: [
    new TableColumn({
      name: 'id',
      type: 'INTEGER',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    }),
    new TableColumn({
      name: 'name',
      type: 'TEXT',
      isNullable: false,
    }),
    new TableColumn({
      name: 'album_artist_id',
      type: 'TEXT',
      isNullable: false,
    }),
    new TableColumn({
      name: 'album_id',
      type: 'TEXT',
      isNullable: false,
    }),
    new TableColumn({
      name: 'relative_file_path',
      type: 'TEXT',
      isNullable: false,
    }),
  ],
});

export class CreateTracksTable1717877381152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(TABLE);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE);
  }
}
