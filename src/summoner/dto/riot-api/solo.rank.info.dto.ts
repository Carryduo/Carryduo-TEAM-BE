export class LeagueEntryDTO {
  leagueId: string;
  queueType: string;
  summonerId: string;
  summonerName: string;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
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
  win: number;
  lose: number;
  winRate: number;
  tier: string;
  tierImg: string;
  lp: number;

  static plainToSoloRankDataDto(data: LeagueEntryDTO | null) {
    const soloRankData = new SoloRankDataDto();
    soloRankData.win = data ? data.wins : 0;
    soloRankData.lose = data ? data.losses : 0;
    soloRankData.winRate = data
      ? Math.floor((data.wins / (data.wins + data.losses)) * 100)
      : 0;
    soloRankData.tier = data ? data.tier + ' ' + data.rank : 'Unranked';
    soloRankData.lp = data ? data.leaguePoints : 0;
    soloRankData.tierImg = data ? tierImgInfo[data.tier] : tierImgInfo.Unranked;
    return soloRankData;
  }
}
