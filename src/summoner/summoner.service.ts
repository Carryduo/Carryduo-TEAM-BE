import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly axios: HttpService,
  ) {}

  // summoner 전적 데이터 연산 및 구조 정렬 함수
  async historyDataCleansing(summonerName: string) {
    const check = await this.summonerRepository.getSummonerHistory(
      summonerName,
    );

    if (!check) {
      return;
    }

    const winInfo = await this.summonerRepository.sumWin(summonerName);

    const recentChampsList = []; //10경기 중 많이 플레이 한 챔피언 리스트

    const recentChamps = await this.summonerRepository.recentChamp(
      summonerName,
    );

    for (let r of recentChamps) {
      recentChampsList.push(r.history_champ_id);
    }

    let recentChampRates = [];

    for (let rc of recentChampsList) {
      const recentChampInfo = await this.summonerRepository.recentChampInfo(rc);

      const recentChampRateInfo = await this.summonerRepository.recentChampRate(
        summonerName,
        rc,
      );

      //이기거나 진 카운트가 없으면 champId는 undifined가 돼서 champId 따로 추가
      if (!recentChampRateInfo.win.history_champ_id) {
        recentChampRateInfo.win.history_champ_id = rc;
      } else if (!recentChampRateInfo.lose.history_champ_id) {
        recentChampRateInfo.lose.history_champ_id = rc;
      }

      const recentChamp = recentChampRateInfo.win.history_champ_id;
      const recentChampWin = Number(recentChampRateInfo.win.winCnt);
      const recentChampLose = Number(recentChampRateInfo.lose.loseCnt);
      const recentChampTotal = recentChampWin + recentChampLose;
      const recentChampRate = (recentChampWin / recentChampTotal) * 100;

      recentChampRates.push({
        recentChampId: recentChamp,
        recentChampImg: recentChampInfo.champ_champ_img,
        recentChampName: recentChampInfo.champ_champ_name_ko,
        recentChampWin,
        recentChampLose,
        recentChampTotal,
        recentChampRate: Number(recentChampRate.toFixed(2)),
      });
    }

    /*탑:1, 정글:2 미드:3, 원딜:4, 서포터:5 */
    const positionId = [1, 2, 3, 4, 5];

    const positions = [];

    for (let pI of positionId) {
      const position = await this.summonerRepository.position(summonerName, pI);
      //해당 positionId가 없으면 임의로 positionId와 0 을 넣어준다.
      if (!position) {
        positions.push({
          id: pI,
          cnt: 0,
        });
      } else if (position) {
        //해당 positionId가 있으면 해당 포지션과 positionId의 합을 넣어준다.
        positions.push({
          id: Number(position.history_position),
          cnt: Number(position.positionCnt),
        });
      }
    }

    const kdaInfo = await this.summonerRepository.kdaAverage(summonerName);
    const kill = Number(kdaInfo.killSum);
    const death = Number(kdaInfo.deathSum);
    const assist = Number(kdaInfo.assistSum);

    const kdaAverage = (kill + assist) / death;
    const killAver = kill / 10;
    const deathAver = death / 10;
    const assiAver = assist / 10;

    const rate = {
      kill: killAver,
      death: deathAver,
      assist: assiAver,
      KDA: Number(kdaAverage.toFixed(2)),
      total: Number(winInfo.totalCnt),
      win: Number(winInfo.winCnt),
      lose: Number(winInfo.totalCnt) - Number(winInfo.winCnt),
      winRate: Math.floor(
        (Number(winInfo.winCnt) / Number(winInfo.totalCnt)) * 100,
      ),
      positions,
      recentChampRate: recentChampRates,
    };

    return rate;
  }

  ///-----------------------------------------------------------------------------------------------/

  // response 데이터 구조 정렬 함수
  async summonerDataCleansing(summoner, history) {
    const mostChamp1 = {
      id: summoner.most1_champId,
      champNameKo: summoner.most1_champ_name_ko,
      champNameEn: summoner.most1_champ_name_en,
      champImg: summoner.most1_champ_main_img,
    };

    const mostChamp2 = {
      id: summoner.most2_champId,
      champNameKo: summoner.most2_champ_name_ko,
      champNameEn: summoner.most2_champ_name_en,
      champImg: summoner.most2_champ_main_img,
    };
    const mostChamp3 = {
      id: summoner.most3_champId,
      champNameKo: summoner.most3_champ_name_ko,
      champNameEn: summoner.most3_champ_name_en,
      champImg: summoner.most3_champ_main_img,
    };

    if (!history) {
      const summonerData = {
        summonerName: summoner.summoner_summonerName,
        summonerIcon: summoner.summoner_summoner_icon,
        summonerLevel: summoner.summoner_summoner_level,
        tier: summoner.summoner_tier,
        lp: summoner.summoner_lp,
        tierImg: summoner.summoner_tier_img,
        win: summoner.summoner_win,
        lose: summoner.summoner_lose,
        winRate: summoner.summoner_win_rate,
        mostChamps: [mostChamp1, mostChamp2, mostChamp3],
      };
      return summonerData;
    } else {
      const summonerData = {
        summonerName: summoner.summoner_summonerName,
        summonerIcon: summoner.summoner_summoner_icon,
        summonerLevel: summoner.summoner_summoner_level,
        tier: summoner.summoner_tier,
        lp: summoner.summoner_lp,
        tierImg: summoner.summoner_tier_img,
        win: summoner.summoner_win,
        lose: summoner.summoner_lose,
        winRate: summoner.summoner_win_rate,
        mostChamps: [mostChamp1, mostChamp2, mostChamp3],
        history,
      };
      return summonerData;
    }
  }

  ///-----------------------------------------------------------------------------------------------/

  //DB summoner 조회 및 라이엇API 요청 함수
  async findSummoner(summonerName: string) {
    const summoner = await this.summonerRepository.findSummoner(summonerName); //기존 유저 찾기
    if (!summoner) {
      const result = await this.summonerRiotRequest(summonerName); //없으면 라이엇 요청

      await this.summonerRepository.insertSummoner(result);

      const summonerInfo = await this.summonerRepository.findSummoner(
        summonerName,
      );
      const newHistory = await this.historyDataCleansing(summonerName);
      return await this.summonerDataCleansing(summonerInfo, newHistory);
    }
    const history = await this.historyDataCleansing(summonerName);
    const summonerData = await this.summonerDataCleansing(summoner, history); //있으면 꺼내서 보여주기
    return summonerData;
  }

  ///-----------------------------------------------------------------------------------------------/

  // 전적 갱신 API
  async RefreshSummoner(summonerName: string) {
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    if (!summoner)
      throw new HttpException(
        '갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)',
        HttpStatus.BAD_REQUEST,
      );

    const result = await this.summonerRiotRequest(summonerName);
    await this.summonerRepository.updateSummoner(result);

    const summonerInfo = await this.summonerRepository.findSummoner(
      summonerName,
    );

    const history = await this.historyDataCleansing(summonerName);

    const summonerData = await this.summonerDataCleansing(
      summonerInfo,
      history,
    );

    return summonerData;
  }

  ///-----------------------------------------------------------------------------------------------/

  //summoner get API
  async getSummoner(summonerName: string) {
    const summoner = await this.findSummoner(summonerName);
    return summoner;
  }

  ///-----------------------------------------------------------------------------------------------/

  //라이엇 API 요청, 데이터 저장 API
  async summonerRiotRequest(summonerName: string) {
    try {
      //SUMMONER
      const response = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/ + ${encodeURIComponent(
            summonerName,
          )} + ?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      const { data } = response;
      const summonerId = data.id;
      const puuId = data.puuid;
      const summonerLevel = data.summonerLevel;

      const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;

      //SUMMONER LEAGUE INFO
      const detailResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      //SUMMONER CHAMP MASTERY
      const mostChampResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}
        `,
        )
        .toPromise();
      const mostChamp = mostChampResponse.data;

      const detailData = detailResponse.data;

      let win: number,
        lose: number,
        winRate: number,
        tier: string,
        rank: string,
        lp: number;

      const soloRankInfo = detailData.find(
        (ele) => ele.queueType === 'RANKED_SOLO_5x5',
      );
      const flexRankInfo = detailData.find(
        (ele) => ele.queueType === 'RANKED_FLEX_SR',
      );

      if (soloRankInfo) {
        win = soloRankInfo.wins;
        lose = soloRankInfo.losses;
        winRate = Math.floor((win / (win + lose)) * 100); // 소수점 버리기
        tier = soloRankInfo.tier;
        rank = soloRankInfo.rank;
        lp = soloRankInfo.leaguePoints;
      } else if (!soloRankInfo && flexRankInfo) {
        win = flexRankInfo.wins;
        lose = flexRankInfo.losses;
        winRate = Math.floor((win / (win + lose)) * 100); // 소수점 버리기
        tier = flexRankInfo.tier;
        rank = flexRankInfo.rank;
        lp = flexRankInfo.leaguePoints;
      } else {
        win = 0;
        lose = 0;
        winRate = 0;
        tier = 'Unranked';
        rank = '';
        lp = 0;
      }

      if (!detailData)
        throw new HttpException(
          '언랭크 소환사 입니다.',
          HttpStatus.BAD_REQUEST,
        );

      let tierImg: string;
      switch (tier) {
        case 'IRON':
          tierImg = 'https://erunjrun.com/tier/Iron.png';
          break;
        case 'BRONZE':
          tierImg = 'https://erunjrun.com/tier/Bronze.png';
          break;
        case 'SILVER':
          tierImg = 'https://erunjrun.com/tier/Silver.png';
          break;
        case 'GOLD':
          tierImg = 'https://erunjrun.com/tier/Gold.png';
          break;
        case 'PLATINUM':
          tierImg = 'https://erunjrun.com/tier/Platinum.png';
          break;
        case 'DIAMOND':
          tierImg = 'https://erunjrun.com/tier/Diamond.png';
          break;
        case 'MASTER':
          tierImg = 'https://erunjrun.com/tier/Master.png';
          break;
        case 'GRANDMASTER':
          tierImg = 'https://erunjrun.com/tier/Grandmaster.png';
          break;
        case 'CHALLENGER':
          tierImg = 'https://erunjrun.com/tier/Challenger.png';
          break;
        case 'Unranked':
          tierImg = '';
          break;
      }
      const summonerData = {
        summonerName,
        summonerId,
        summonerIcon,
        summonerLevel,
        tier: tier + ' ' + rank,
        lp,
        tierImg,
        win,
        lose,
        winRate,
        mostChamp1: mostChamp[0].championId,
        mostChamp2: mostChamp[1].championId,
        mostChamp3: mostChamp[2].championId,
      };

      //SUMMONER MATCH ID
      const matchIdResponse = await this.axios
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY}
      `,
        )
        .toPromise();

      //------------------------------------------------------------------------------------------------------------------------------------//

      //유저 최근 전적 요청 부분

      const getSummonerHistory =
        await this.summonerRepository.getSummonerHistory(summonerName);

      if (getSummonerHistory) {
        await this.summonerRepository.deleteSummonerHistory(summonerName);
      }

      for (let m of matchIdResponse.data) {
        //SUMMONER MATCH DATA
        const matchDataResponse = await this.axios
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${process.env.RIOT_API_KEY}`,
          )
          .toPromise();

        const matchData = matchDataResponse.data.info;

        let position;

        if (matchData.gameMode === 'CLASSIC') {
          for (let p of matchData.participants) {
            if (p.puuid === puuId) {
              switch (p.teamPosition) {
                case 'TOP':
                  position = 1;
                  break;
                case 'JUNGLE':
                  position = 2;
                  break;
                case 'MIDDLE':
                  position = 3;
                  break;
                case 'BOTTOM':
                  position = 4;
                  break;
                case 'UTILITY':
                  position = 5;
                  break;
              }

              const history = {
                win: p.win,
                kill: p.kills,
                death: p.deaths,
                assist: p.assists,
                champId: p.championId,
                position,
                summonerName: p.summonerName,
                summonerId: p.summonerId,
                matchId: m,
              };
              await this.summonerRepository.createSummonerHistory(history);
            } else {
              continue;
            }
          }
        }
      }
      return summonerData;
    } catch (err) {
      console.log(err);
      if (err.response.status === 429) {
        throw new HttpException(
          '라이엇API 요청 과도화',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else if (err.response.status === 403) {
        throw new HttpException('라이엇API 키 만료', HttpStatus.FORBIDDEN);
      } else if (err.status === 400) {
        throw new HttpException(err.response, err.status);
      } else {
        throw new HttpException(err.response.statusText, err.response.status);
      }
    }
  }
}
