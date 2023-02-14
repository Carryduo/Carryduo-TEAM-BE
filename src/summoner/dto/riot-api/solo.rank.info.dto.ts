export class LeagueEntryDTO {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

const tierImgInfo = {
  IRON: 'https://erunjrun.com/tier/Iron.png',
  BRONZE: 'https://erunjrun.com/tier/Bronze.png',
  SILVER: 'https://erunjrun.com/tier/Silver.png',
  GOLD: 'https://erunjrun.com/tier/Gold.png',
  PLATINUM: 'https://erunjrun.com/tier/Platinum.png',
  DIAMOND: 'https://erunjrun.com/tier/Diamond.png',
  MASTER: 'https://erunjrun.com/tier/Master.png',
  GRANDMASTER: 'https://erunjrun.com/tier/Grandmaster.png',
  CHALLENGER: 'https://erunjrun.com/tier/Challenger.png',
  Unranked: '',
};

export class SoloRankDataDto {
  private win: number;
  private lose: number;
  private winRate: number;
  private tier: string;
  private lp: number;
  private tierImg: string;

  leaguePoints: number;
  static transformSoloRankData(data: LeagueEntryDTO[] | null) {
    const soloRankData = new SoloRankDataDto();
    soloRankData.win = data ? data[0].wins : 0;
    soloRankData.lose = data ? data[0].losses : 0;
    soloRankData.winRate = data
      ? Math.floor((data[0].wins / (data[0].wins + data[0].losses)) * 100)
      : 0;
    soloRankData.tier = data ? data[0].tier + ' ' + data[0].rank : 'Unranked';
    soloRankData.lp = data ? data[0].leaguePoints : 0;
    soloRankData.tierImg = data ? tierImgInfo[data[0].tier] : tierImgInfo.Unranked;
    return soloRankData;
  }
}
