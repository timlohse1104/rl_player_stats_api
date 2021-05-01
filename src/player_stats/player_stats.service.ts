import { Injectable, NotFoundException, Patch } from '@nestjs/common';
import { GenericMetaStats, GenericPlaylistStats, PlayerMetaData, PlayerMetaStats, PlayerPlaylistStats, PlayerStats } from './player_stats.model';
// import * as cheerio from 'cheerio';
import * as rp from 'request-promise';
import { exit } from 'node:process';

// Example RL tracker api data
// https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/Tilloh

@Injectable()
export class PlayerStatsService {
  private response;
  private lifetimeStats;
  private unrankedData;
  private ranked1v1Data;
  private ranked2v2Data;
  private ranked3v3Data;
  private hoopsData;
  private rumbleData;
  private dropshotData;
  private snowdayData;
  private tournamentData;

  async getPlayerStats(id: number): Promise<PlayerStats> {
    if (await this.requestPlayerInformation(id)) {
        let playerStats = new PlayerStats(
          id,
          new PlayerMetaData(
            this.getPlayerName(),
            this.getPlayerAvatar(),
            this.getPlayerPlatform(),
            this.getPlayerViews()
          ),
          new PlayerMetaStats(
            this.getPlayerMetaWins(),
            this.getPlayerMetaGoalShotRatio(),
            this.getPlayerMetaGoals(),
            this.getPlayerMetaShots(),
            this.getPlayerMetaAssists(),
            this.getPlayerMetaSaves(),
            this.getPlayerMetaMvps()
          ),
          new PlayerPlaylistStats(
            this.getPlayerPlaylistUnranked(),
            this.getPlayerPlaylistRanked1v1(),
            this.getPlayerPlaylistRanked2v2(),
            this.getPlayerPlaylistRanked3v3(),
            this.getPlayerPlaylistHoops(),
            this.getPlayerPlaylistRumble(),
            this.getPlayerPlaylistDropshot(),
            this.getPlayerPlaylistSnowday(),
            this.getPlayerPlaylistTournament()
          )
        )
      return playerStats;
    }
    throw new NotFoundException(`Could not find player with id "${id}"`)
  }

  async requestPlayerInformation(id: number): Promise<boolean> {
    const player_url = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/${id}?`
    let apiResponse;

    try {
      apiResponse = await rp.get({
        uri: player_url,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip",
            "accept-language": "de,de-DE;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51"
          },
        gzip: true
      })
    } catch (err) {
      console.log(err.message)
      return false;
    }
    
    this.response = JSON.parse(apiResponse);
    
    this.lifetimeStats = this.response.data.segments[0].stats;
    this.unrankedData = this.response.data.segments[1];
    this.ranked1v1Data = this.response.data.segments[2];
    this.ranked2v2Data = this.response.data.segments[3];
    this.ranked3v3Data = this.response.data.segments[4];
    this.hoopsData = this.response.data.segments[5];
    this.rumbleData = this.response.data.segments[6];
    this.dropshotData = this.response.data.segments[7];
    this.snowdayData = this.response.data.segments[8];
    this.tournamentData = this.response.data.segments[9];  
  
    return true;
  }

  // Get player meta data
  getPlayerName(): string {
    return this.response.data.platformInfo.platformUserHandle;
  }
  getPlayerAvatar(): string {
    return this.response.data.platformInfo.avatarUrl;
  }
  getPlayerPlatform(): string {
    return this.response.data.platformInfo.platformSlug;
  }
  getPlayerViews(): number {
    return this.response.data.userInfo.pageviews;
  }

  // Get player meta statistics
  getPlayerMetaWins(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.wins.displayName,
      this.lifetimeStats.wins.value,
      this.lifetimeStats.wins.percentile
    )
  }
  getPlayerMetaGoalShotRatio(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.goalShotRatio.displayName,
      this.lifetimeStats.goalShotRatio.value,
      this.lifetimeStats.goalShotRatio.percentile
    )
  }
  getPlayerMetaGoals(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.goals.displayName,
      this.lifetimeStats.goals.value,
      this.lifetimeStats.goals.percentile
    )
  }
  getPlayerMetaShots(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.shots.displayName,
      this.lifetimeStats.shots.value,
      this.lifetimeStats.shots.percentile
    )
  }
  getPlayerMetaAssists(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.assists.displayName,
      this.lifetimeStats.assists.value,
      this.lifetimeStats.assists.percentile
    )
  }
  getPlayerMetaSaves(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.saves.displayName,
      this.lifetimeStats.saves.value,
      this.lifetimeStats.saves.percentile
    )
  }
  getPlayerMetaMvps(): GenericMetaStats {
    return new GenericMetaStats(
      this.lifetimeStats.mVPs.displayName,
      this.lifetimeStats.mVPs.value,
      this.lifetimeStats.mVPs.percentile
    )
  }

  // Get player playlist statistics
  getPlayerPlaylistUnranked() {
    return new GenericPlaylistStats(
      this.unrankedData?.metadata.name,
      this.unrankedData?.stats.tier.metadata.name,
      this.unrankedData?.stats.division.metadata.name,
      this.unrankedData?.stats.rating.value,
      this.unrankedData?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistRanked1v1() {
    return new GenericPlaylistStats(
      this.ranked1v1Data?.metadata.name,
      this.ranked1v1Data?.stats.tier.metadata.name,
      this.ranked1v1Data?.stats.division.metadata.name,
      this.ranked1v1Data?.stats.rating.value,
      this.ranked1v1Data?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistRanked2v2() {
    return new GenericPlaylistStats(
      this.ranked2v2Data?.metadata.name,
      this.ranked2v2Data?.stats.tier.metadata.name,
      this.ranked2v2Data?.stats.division.metadata.name,
      this.ranked2v2Data?.stats.rating.value,
      this.ranked2v2Data?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistRanked3v3() {
    return new GenericPlaylistStats(
      this.ranked3v3Data?.metadata.name,
      this.ranked3v3Data?.stats.tier.metadata.name,
      this.ranked3v3Data?.stats.division.metadata.name,
      this.ranked3v3Data?.stats.rating.value,
      this.ranked3v3Data?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistHoops() {
    return new GenericPlaylistStats(
      this.hoopsData?.metadata.name,
      this.hoopsData?.stats.tier.metadata.name,
      this.hoopsData?.stats.division.metadata.name,
      this.hoopsData?.stats.rating.value,
      this.hoopsData?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistRumble() {
    return new GenericPlaylistStats(
      this.rumbleData?.metadata.name,
      this.rumbleData?.stats.tier.metadata.name,
      this.rumbleData?.stats.division.metadata.name,
      this.rumbleData?.stats.rating.value,
      this.rumbleData?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistDropshot() {
    return new GenericPlaylistStats(
      this.dropshotData?.metadata.name,
      this.dropshotData?.stats.tier.metadata.name,
      this.dropshotData?.stats.division.metadata.name,
      this.dropshotData?.stats.rating.value,
      this.dropshotData?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistSnowday() {
    return new GenericPlaylistStats(
      this.snowdayData?.metadata.name,
      this.snowdayData?.stats.tier.metadata.name,
      this.snowdayData?.stats.division.metadata.name,
      this.snowdayData?.stats.rating.value,
      this.snowdayData?.stats.rating.percentile,
    )
  }
  getPlayerPlaylistTournament() {
    return new GenericPlaylistStats(
      this.tournamentData?.metadata.name,
      this.tournamentData?.stats.tier.metadata.name,
      this.tournamentData?.stats.division.metadata.name,
      this.tournamentData?.stats.rating.value,
      this.tournamentData?.stats.rating.percentile,
    )
  }
}

// Use search field of main page
// $('form > input').value = "Tilloh"
// $('form > input').click()
// $('div[class="player-row"] > div').click()

// Scrape player overview site
//$('span[class="trn-ign__username"]').innerText