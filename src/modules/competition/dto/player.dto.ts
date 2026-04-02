import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class CreatePlayerDto {
  @ApiProperty({ description: '球员姓名' })
  @IsString()
  name: string

  @ApiProperty({ description: '当前让分数', required: false })
  @IsOptional()
  @IsInt()
  handicap?: number
}

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {}

export class QueryPlayerDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiProperty({ description: '每页条数', required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number

  @ApiProperty({ description: '球员姓名', required: false })
  @IsOptional()
  @IsString()
  name?: string
}
