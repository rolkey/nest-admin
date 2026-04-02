import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CompetitionController } from './competition.controller'
import { CompetitionService } from './competition.service'
import { HandicapRecordEntity, MatchEntity, MatchPlayerEntity, PlayerEntity } from './match-group.entity'

const entities = [PlayerEntity, MatchEntity, MatchPlayerEntity, HandicapRecordEntity]

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [CompetitionController],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {}
