import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  SummonerDataCleansingDTO,
  SummonerRequestDTO,
} from './dto/summoner/summoner.dto';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly axios: HttpService,
  ) {}

  ///-----------------------------------------------------------------------------------------------/

  // summoner 전적 데이터 연산 및 구조 정렬 함수
  async historyDataCleansing(summonerName: string) {
    const winInfo = await this.summonerRepository.sumWin(summonerName);

    const recentChampsList = [];

    const recentChamps = await this.summonerRepository.recentChamp(
      summonerName,
    );
    // console.log(recentChamps);

    for (let r of recentChamps) {
      recentChampsList.push(r.history_champ_id);
    }

    const recentChampRate = await this.summonerRepository.recentChampRate(
      summonerName,
      recentChampsList,
    );
    console.log(recentChampRate);

    // for (let r of recentChampRate) {
    //   for (let rc of recentChampsList) {
    //     if(r. history_champ_id === rc && ){
    //     }
    //   }
    // }

    // const recentChamp1 = await this.summonerRepository.recentChampRate1(
    //   summonerName,
    //   recentChampsList[0],
    // );
    // const recentChamp2 = await this.summonerRepository.recentChampRate2(
    //   summonerName,
    //   recentChampsList[1],
    // );
    // const recentChamp3 = await this.summonerRepository.recentChampRate3(
    //   summonerName,
    //   recentChampsList[2],
    // );

    // const recentChampImg = await this.summonerRepository.champImg(
    //   recentChampsList,
    // );

    // let positions = [];
    // const position = await this.summonerRepository.position(summonerName);
    // for (let p of position) {
    //   positions.push({ id: p.history_position, cnt: Number(p.positionCnt) });
    // }
    // const rate = {
    //   total: Number(winInfo.totalCnt),
    //   win: Number(winInfo.winCnt),
    //   lose: Number(winInfo.totalCnt) - Number(winInfo.winCnt),
    //   winRate: (Number(winInfo.winCnt) / Number(winInfo.totalCnt)) * 100,
    //   positions,
    // recentChampRate: [
    //   {
    //     recentChamp1: recentChampsList[0],
    //     recentChampWin1: recentChamp1.winCnt1,
    //     recentChampLose1: recentChamp1.loseCnt1,
    //     recentChampRate1:
    //       (recentChamp1.winCnt1 /
    //         (recentChamp1.winCnt1 + recentChamp1.loseCnt1)) *
    //       100,
    //     recentChampImg: recentChampImg[0].champ_champ_img,
    //   },
    //   {
    //     recentChamp2: recentChampsList[1],
    //     recentChampWin2: recentChamp2.winCnt2,
    //     recentChampLose2: recentChamp2.loseCnt2,
    //     recentChampRate2:
    //       (recentChamp2.winCnt2 /
    //         (recentChamp2.winCnt2 + recentChamp2.loseCnt2)) *
    //       100,
    //     recentChampImg: recentChampImg[1].champ_champ_img,
    //   },
    //   {
    //     recentChamp3: recentChampsList[2],
    //     recentChampWin3: recentChamp3.winCnt3,
    //     recentChampLose3: recentChamp3.loseCnt3,
    //     recentChampRate3:
    //       (recentChamp3.winCnt3 /
    //         (recentChamp3.winCnt3 + recentChamp3.loseCnt3)) *
    //       100,
    //     recentChampImg: recentChampImg[2].champ_champ_img,
    //   },
    // ],
    // };

    // return rate;
  }

  ///-----------------------------------------------------------------------------------------------/

  // response 데이터 구조 정렬 함수
  async summonerDataCleansing(summoner: SummonerDataCleansingDTO, history) {
    const summonerData = {
      summonerName: summoner.summonerName,
      summonerId: summoner.summonerId,
      summonerIcon: summoner.summonerIcon,
      summonerLevel: summoner.summonerLevel,
      tier: summoner.tier,
      lp: summoner.lp,
      tierImg: summoner.tierImg,
      win: summoner.win,
      lose: summoner.lose,
      winRate: summoner.winRate,
      mostChamps: [
        summoner.mostChamp1,
        summoner.mostChamp2,
        summoner.mostChamp3,
      ],
      history,
    };
    return summonerData;
  }

  ///-----------------------------------------------------------------------------------------------/

  //DB summoner 조회 및 라이엇API 요청 함수
  async findSummoner(summonerName: string) {
    const summoner = await this.summonerRepository.findSummoner(summonerName); //한글 안먹음
    if (!summoner) {
      const result = await this.summonerRiotRequest(summonerName);

      await this.summonerRepository.insertSummoner(result);

      const summonerInfo = await this.summonerRepository.findSummoner(
        summonerName,
      );
      const newHistory = await this.historyDataCleansing(summonerName);
      return await this.summonerDataCleansing(summonerInfo, newHistory);
    }
    const history = await this.historyDataCleansing(summonerName);
    return await this.summonerDataCleansing(summoner, history);
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
    // const summonerData = await this.summonerDataCleansing(summonerInfo);
    // return summonerData;
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
      const response = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/ + ${encodeURIComponent(
            summonerName,
          )} + ?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      const { data } = response;
      const puuId = data.puuid;

      const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;

      const detailResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      const mostChampResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}
        `,
        )
        .toPromise();
      const mostchamp = mostChampResponse.data;

      const detailData = detailResponse.data[0];

      if (!detailData)
        throw new HttpException(
          '언랭크 소환사 입니다.',
          HttpStatus.BAD_REQUEST,
        );

      const win = detailData.wins;
      const lose = detailData.losses;

      const winRate = Math.floor((win / (win + lose)) * 100);
      let image: string;
      switch (detailData.tier) {
        case 'IRON':
          image = 'https://erunjrun.com/tier/Iron.png';
          break;
        case 'BRONZE':
          image = 'https://erunjrun.com/tier/Bronze.png';
          break;
        case 'SILVER':
          image = 'https://erunjrun.com/tier/Silver.png';
          break;
        case 'GOLD':
          image = 'https://erunjrun.com//tier/Gold.png';
          break;
        case 'PLATINUM':
          image = 'https://erunjrun.com/tier/Platinum.png';
          break;
        case 'DIAMOND':
          image = 'https://erunjrun.com/tier/Diamond.png';
          break;
        case 'MASTER':
          image = 'https://erunjrun.com/tier/Master.png';
          break;
        case 'GRANDMASTER':
          image = 'https://erunjrun.com/tier/Grandmaster.png';
          break;
        case 'CHALLENGER':
          image = 'https://erunjrun.com/tier/Challenger.png';
          break;
      }
      const matchIdResponse = await this.axios
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY}
      `,
        )
        .toPromise();

      const summonerId = data.id;

      const beforeMatchId = await this.summonerRepository.beforeMatchId(
        summonerId,
      );

      let beforeMatchIds = [];

      for (let b of beforeMatchId) {
        beforeMatchIds.push(b.history_match_id);
      }
      for (let m of matchIdResponse.data) {
        const matchDataResponse = await this.axios
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${process.env.RIOT_API_KEY}`,
          )
          .toPromise();

        const matchData = matchDataResponse.data.info;

        let position;

        if (matchData.gameMode === 'CLASSIC') {
          for (let p of matchData.participants) {
            // => 기존에 있는 matchId 와 중복되지 않는 matchId만 사용/summonerName이 rds에서 먹히지 않아 puuId 사용
            if (!beforeMatchIds.includes(m) && p.puuid === puuId) {
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

      const summonerData = {
        summonerName: data.name,
        summonerId,
        summonerIcon,
        summonerLevel: data.summonerLevel,
        tier: detailData.tier + ' ' + detailData.rank,
        lp: detailData.leaguePoints,
        tierImg: image,
        win: detailData.wins,
        lose: detailData.losses,
        winRate,
        mostChamp1: mostchamp[0].championId,
        mostChamp2: mostchamp[1].championId,
        mostChamp3: mostchamp[2].championId,
      };
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
