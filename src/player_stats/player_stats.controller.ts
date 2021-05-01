import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
  import { PlayerStatsService } from './player_stats.service';
  
  @Controller('player_stats')
  export class PlayerStatsController {
    constructor(private readonly playerStatsService: PlayerStatsService) {}
  
    @Get(':id')
    getPlayerStats(@Param('id') id: number) {
      return this.playerStatsService.getPlayerStats(id);
    }
  }
  