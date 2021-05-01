import { Module } from '@nestjs/common';
import { PlayerStatsModule } from './player_stats/player_stats.module';

@Module({
  imports: [PlayerStatsModule],
})
export class AppModule {}
