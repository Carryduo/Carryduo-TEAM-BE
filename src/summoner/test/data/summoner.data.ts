export const summonerDto = {
  summonerName: '할배탈',
  summonerId: 'Xtuzku0AfucpULmsfXCT8c6ybe96Y7aVrPrBLjfy8xh_QBw',
  summonerIcon: 'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/1628.png',
  summonerLevel: '180',
  summonerPuuId: 'rNs_hmUPsdkwl_1psIBND7GCnaP2ckz8b_a5RPut4sO5w3HEWdxpWWi194GpWZPVKtzVwXkhu_lbGw',
  tier: 'GOLD IV',
  lp: 1,
  tierImg: 'https://erunjrun.com/tier/Gold.png',
  win: 82,
  lose: 60,
  winRate: 57,
  mostChamp1: 81,
  mostChamp2: 412,
  mostChamp3: 222,
};

export const unrankSummonerDto = {
  summonerName: '할배탈',
  summonerId: 'Xtuzku0AfucpULmsfXCT8c6ybe96Y7aVrPrBLjfy8xh_QBw',
  summonerIcon: 'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/1628.png',
  summonerLevel: '180',
  summonerPuuId: 'rNs_hmUPsdkwl_1psIBND7GCnaP2ckz8b_a5RPut4sO5w3HEWdxpWWi194GpWZPVKtzVwXkhu_lbGw',
  lp: 0,
  tierImg: '',
  win: 0,
  lose: 0,
  winRate: 0,
  mostChamp1: 81,
  mostChamp2: 412,
  mostChamp3: 222,
  tier: 'Unranked',
};

export const RepositoryGetSummoner = {
  summonerName: '할배탈',
  summonerId: 'Xtuzku0AfucpULmsfXCT8c6ybe96Y7aVrPrBLjfy8xh_QBw',
  summonerIcon: 'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/1628.png',
  summonerLevel: '183',
  tier: 'Unranked',
  tierImg: '',
  lp: 0,
  win: 0,
  lose: 0,
  winRate: 0,
  mostChamp1: {
    id: '81',
    champNameKo: '이즈리얼',
    champNameEn: 'Ezreal',
    champMainImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Ezreal_0.jpg',
  },
  mostChamp2: {
    id: '412',
    champNameKo: '쓰레쉬',
    champNameEn: 'Thresh',
    champMainImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Thresh_0.jpg',
  },
  mostChamp3: {
    id: '222',
    champNameKo: '징크스',
    champNameEn: 'Jinx',
    champMainImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Jinx_0.jpg',
  },
};

export const positionInfoData = [
  {
    id: 4,
    cnt: 4,
  },
  {
    id: 5,
    cnt: 1,
  },
];

export const recentChampInfoData = [
  { count: '3', champId: '360' },
  { count: '1', champId: '18' },
  { count: '1', champId: '32' },
];

export const recentChampRateData = [
  {
    recentChampId: '360',
    recentChampName: '사미라',
    recentChampImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Samira.png',
    recentChampWin: 1,
    recentChampLose: 2,
    recentChampTotal: 3,
    recentChampRate: 33.33,
  },
  {
    recentChampId: '18',
    recentChampName: '트리스타나',
    recentChampImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Tristana.png',
    recentChampWin: 1,
    recentChampLose: 0,
    recentChampTotal: 1,
    recentChampRate: 100,
  },
  {
    recentChampId: '32',
    recentChampName: '아무무',
    recentChampImg:
      'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Amumu.png',
    recentChampWin: 1,
    recentChampLose: 0,
    recentChampTotal: 1,
    recentChampRate: 100,
  },
];

export const recordSumInfoData = {
  winCount: '3',
  killCount: '10',
  deathCount: '4',
  assistCount: '5.6',
  totalCount: '5',
};

export const summonerResponseDto = {
  summonerName: '할배탈',
  summonerId: 'Xtuzku0AfucpULmsfXCT8c6ybe96Y7aVrPrBLjfy8xh_QBw',
  summonerIcon: 'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/1628.png',
  summonerLevel: '183',
  tier: 'Unranked',
  tierImg: '',
  lp: 0,
  win: 0,
  lose: 0,
  winRate: 0,
  mostChamps: [
    {
      id: '81',
      champNameKo: '이즈리얼',
      champNameEn: 'Ezreal',
      champMainImg:
        'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Ezreal_0.jpg',
    },
    {
      id: '412',
      champNameKo: '쓰레쉬',
      champNameEn: 'Thresh',
      champMainImg:
        'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Thresh_0.jpg',
    },
    {
      id: '222',
      champNameKo: '징크스',
      champNameEn: 'Jinx',
      champMainImg:
        'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/main/Jinx_0.jpg',
    },
  ],
  history: {
    kill: 10,
    death: 4,
    assist: 5.6,
    KDA: 3.9,
    total: 5,
    win: 3,
    lose: 2,
    winRate: 60,
    positions: [
      {
        id: 1,
        cnt: 0,
      },
      {
        id: 2,
        cnt: 0,
      },
      {
        id: 3,
        cnt: 0,
      },
      {
        id: 4,
        cnt: 4,
      },
      {
        id: 5,
        cnt: 1,
      },
    ],
    recentChamp: [
      {
        recentChampId: '360',
        recentChampName: '사미라',
        recentChampImg:
          'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Samira.png',
        recentChampWin: 1,
        recentChampLose: 2,
        recentChampTotal: 3,
        recentChampRate: 33.33,
      },
      {
        recentChampId: '18',
        recentChampName: '트리스타나',
        recentChampImg:
          'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Tristana.png',
        recentChampWin: 1,
        recentChampLose: 0,
        recentChampTotal: 1,
        recentChampRate: 100,
      },
      {
        recentChampId: '32',
        recentChampName: '아무무',
        recentChampImg:
          'https://carryduo-image.s3.ap-northeast-2.amazonaws.com/13.1/champion/common/Amumu.png',
        recentChampWin: 1,
        recentChampLose: 0,
        recentChampTotal: 1,
        recentChampRate: 100,
      },
    ],
  },
};
