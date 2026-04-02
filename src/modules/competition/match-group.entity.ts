import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('competition_player')
export class PlayerEntity extends CommonEntity {
  @Column({ length: 50 })
  @ApiProperty({ description: '球员姓名' })
  name: string

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '当前让分数' })
  handicap: number

  @Column({ type: 'smallint', default: 1 })
  @ApiProperty({ description: '状态：1-启用，0-禁用' })
  status: number
}

@Entity('competition_match')
export class MatchEntity extends CommonEntity {
  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '比赛时间' })
  matchTime: Date

  @Column({ type: 'smallint', default: 0 })
  @ApiProperty({ description: '比赛状态：0-未开始，1-进行中，2-已完成' })
  status: number

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: '分组类型：two-双方，multi-多方' })
  groupType: string

  @Column({ type: 'int', default: 2 })
  @ApiProperty({ description: '分组数量' })
  groupCount: number
}

@Entity('competition_match_player')
export class MatchPlayerEntity extends CommonEntity {
  @Column({ type: 'int' })
  @ApiProperty({ description: '比赛ID' })
  matchId: number

  @Column({ type: 'int' })
  @ApiProperty({ description: '球员ID' })
  playerId: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '本次让分数' })
  handicap: number

  @Column({ type: 'smallint', default: 0 })
  @ApiProperty({ description: '是否获胜：0-否，1-是' })
  isWinner: number

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: '对手ID' })
  opponentId: number

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: '分组：甲方/乙方等' })
  group: string
}

@Entity('competition_handicap_record')
export class HandicapRecordEntity extends CommonEntity {
  @Column({ type: 'int' })
  @ApiProperty({ description: '比赛ID' })
  matchId: number

  @Column({ length: 20, nullable: true })
  @ApiProperty({ description: '分组名称' })
  groupName: string

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '赛前让分' })
  beforeHandicap: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '赛后让分' })
  afterHandicap: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '变化量' })
  changeAmount: number
}
