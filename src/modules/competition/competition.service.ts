import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreatePlayerDto, QueryPlayerDto, UpdatePlayerDto } from './dto/player.dto'
import { HandicapRecordEntity, MatchEntity, MatchPlayerEntity, PlayerEntity } from './match-group.entity'

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(PlayerEntity)
    private playerRepository: Repository<PlayerEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(MatchPlayerEntity)
    private matchPlayerRepository: Repository<MatchPlayerEntity>,
    @InjectRepository(HandicapRecordEntity)
    private handicapRecordRepository: Repository<HandicapRecordEntity>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const player = this.playerRepository.create(createPlayerDto)
    return this.playerRepository.save(player)
  }

  async findAllPlayer(query: QueryPlayerDto) {
    const { page = 1, limit = 10, name } = query
    const qb = this.playerRepository.createQueryBuilder('player')

    if (name) {
      qb.where('player.name LIKE :name', { name: `%${name}%` })
    }

    const [list, total] = await qb
      .orderBy('player.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { list, total, page, limit }
  }

  async findOnePlayer(id: number) {
    return this.playerRepository.findOne({ where: { id } })
  }

  async updatePlayer(id: number, updatePlayerDto: UpdatePlayerDto) {
    await this.playerRepository.update(id, updatePlayerDto)
    return this.findOnePlayer(id)
  }

  async removePlayer(id: number) {
    await this.playerRepository.delete(id)
    return { success: true }
  }

  private async getGroupHandicap(groupName: string): Promise<number> {
    const lastRecord = await this.handicapRecordRepository.findOne({
      where: { groupName },
      order: { createdAt: 'DESC' },
    })
    return lastRecord ? lastRecord.afterHandicap : 0
  }

  async createMatch(groups: { group: string, playerIds: number[] }[]) {
    const groupType = groups.length === 2 ? 'two' : 'multi'
    const match = this.matchRepository.create({
      matchTime: new Date(),
      status: 1,
      groupType,
      groupCount: groups.length,
    })
    const savedMatch = await this.matchRepository.save(match)

    const matchPlayers: Partial<MatchPlayerEntity>[] = []

    for (const g of groups) {
      const handicap = await this.getGroupHandicap(g.group)

      for (const playerId of g.playerIds) {
        const opponentIds = groups
          .filter(gg => gg.group !== g.group)
          .flatMap(gg => gg.playerIds)

        matchPlayers.push({
          matchId: savedMatch.id,
          playerId,
          handicap,
          opponentId: opponentIds[0] || null,
          group: g.group,
        })
      }
    }

    await this.matchPlayerRepository.save(matchPlayers)
    return this.findOneMatch(savedMatch.id)
  }

  async findAllMatch() {
    const matches = await this.matchRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['matchPlayers', 'matchPlayers.player'],
    })
    return matches
  }

  async findOneMatch(id: number) {
    return this.matchRepository.findOne({
      where: { id },
      relations: ['matchPlayers', 'matchPlayers.player'],
    })
  }

  async submitResult(matchId: number, winnerGroup: string) {
    const matchPlayers = await this.matchPlayerRepository.find({
      where: { matchId },
    })

    const groups = [...new Set(matchPlayers.map(mp => mp.group))]

    for (const group of groups) {
      const groupPlayers = matchPlayers.filter(mp => mp.group === group)
      const isWinner = group === winnerGroup
      const beforeHandicap = groupPlayers[0].handicap
      const afterHandicap = isWinner ? beforeHandicap + 5 : beforeHandicap
      const changeAmount = afterHandicap - beforeHandicap

      for (const mp of groupPlayers) {
        mp.isWinner = isWinner ? 1 : 0
        mp.handicap = afterHandicap
        await this.matchPlayerRepository.save(mp)

        await this.playerRepository.update(mp.playerId, { handicap: afterHandicap })
      }

      await this.handicapRecordRepository.save({
        matchId,
        groupName: group,
        beforeHandicap,
        afterHandicap,
        changeAmount,
      })
    }

    await this.matchRepository.update(matchId, { status: 2 })
    return this.findOneMatch(matchId)
  }
}
