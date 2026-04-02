import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class Competition1712000000000 implements MigrationInterface {
  name = 'Competition1712000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'competition_player',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'handicap',
            type: 'int',
            default: 0,
            comment: '当前让分数',
          },
          {
            name: 'status',
            type: 'smallint',
            default: 1,
            comment: '状态：1-启用，0-禁用',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'competition_match',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'match_time',
            type: 'timestamp',
            isNullable: true,
            comment: '比赛时间',
          },
          {
            name: 'status',
            type: 'smallint',
            default: 0,
            comment: '比赛状态：0-未开始，1-进行中，2-已完成',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'competition_match_player',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'match_id',
            type: 'int',
            comment: '比赛ID',
          },
          {
            name: 'player_id',
            type: 'int',
            comment: '球员ID',
          },
          {
            name: 'handicap',
            type: 'int',
            default: 0,
            comment: '本次让分数',
          },
          {
            name: 'is_winner',
            type: 'smallint',
            default: 0,
            comment: '是否获胜：0-否，1-是',
          },
          {
            name: 'opponent_id',
            type: 'int',
            isNullable: true,
            comment: '对手ID',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    )

    await queryRunner.createForeignKey(
      'competition_match_player',
      new TableForeignKey({
        columnNames: ['match_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'competition_match',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'competition_match_player',
      new TableForeignKey({
        columnNames: ['player_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'competition_player',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('competition_match_player')
    await queryRunner.dropTable('competition_match')
    await queryRunner.dropTable('competition_player')
  }
}
