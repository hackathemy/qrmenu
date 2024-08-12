import { ApiProperty } from '@nestjs/swagger';

export class GetStatsRequestQueryDto {
  @ApiProperty()
  dateMin: string;

  @ApiProperty()
  dateMax: string;

  @ApiProperty()
  interval: '1 day' | '1 week' | '1 month' | '3 month' | '6 month';
}

export class GetStatsResponseDto {
  @ApiProperty()
  createdData: StatsData[];

  @ApiProperty()
  activeData: StatsData[];

  @ApiProperty()
  inActiveData: StatsData[];

  @ApiProperty({ description: '증감값' })
  createdPrevSize: number;
  @ApiProperty({ description: '증감값' })
  activePrevSize: number;
  @ApiProperty({ description: '증감값' })
  inActivePrevSize: number;
}

export class StatsData {
  @ApiProperty()
  date: string;

  @ApiProperty()
  value: number;
}
