import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { CompetitionService } from './competition.service'
import { CreatePlayerDto, QueryPlayerDto, UpdatePlayerDto } from './dto/player.dto'

@ApiTags('比赛管理')
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post('player')
  @ApiOperation({ summary: '创建球员' })
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.competitionService.createPlayer(createPlayerDto)
  }

  @Get('player')
  @ApiOperation({ summary: '获取球员列表' })
  findAllPlayer(@Query() query: QueryPlayerDto) {
    return this.competitionService.findAllPlayer(query)
  }

  @Get('player/:id')
  @ApiOperation({ summary: '获取球员详情' })
  findOnePlayer(@Param('id') id: string) {
    return this.competitionService.findOnePlayer(+id)
  }

  @Patch('player/:id')
  @ApiOperation({ summary: '更新球员' })
  updatePlayer(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.competitionService.updatePlayer(+id, updatePlayerDto)
  }

  @Delete('player/:id')
  @ApiOperation({ summary: '删除球员' })
  removePlayer(@Param('id') id: string) {
    return this.competitionService.removePlayer(+id)
  }

  @Post('match')
  @ApiOperation({ summary: '创建比赛' })
  createMatch(@Body() body: { groups: { group: string, playerIds: number[] }[] }) {
    return this.competitionService.createMatch(body.groups)
  }

  @Get('match')
  @ApiOperation({ summary: '获取比赛列表' })
  findAllMatch() {
    return this.competitionService.findAllMatch()
  }

  @Get('match/:id')
  @ApiOperation({ summary: '获取比赛详情' })
  findOneMatch(@Param('id') id: string) {
    return this.competitionService.findOneMatch(+id)
  }

  @Post('match/:id/result')
  @ApiOperation({ summary: '提交比赛结果' })
  submitResult(
    @Param('id') id: string,
    @Body() body: { winnerGroup: string },
  ) {
    return this.competitionService.submitResult(+id, body.winnerGroup)
  }
}
