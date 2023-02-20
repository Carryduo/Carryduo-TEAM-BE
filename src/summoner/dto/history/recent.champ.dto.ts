import { SummonerHistoryEntity } from 'src/summoner/entities/summoner.history.entity';

export class recentChampInfo {
  champ_champId: string;
  champ_champ_name_ko: string;
  champ_champ_img: string;
  recentChampWin: string;
}

export class RecentChampDto {
  recentChampId: number;
  recentChampImg: string;
  recentChampName: string;
  recentChampWin: number;
  recentChampLose: number;
  recentChampTotal: number;
  recentChampRate: number;

  static plainToRecentChampDto(data: recentChampInfo[], recentChamps: string[]) {
    //     const recentChampInfo = []
    //     for(let r of recentChamps){
    //         for (let d of data) {
    //             if(r === d.champId.id){
    //                 recentChampInfo.push({id:d.champId.id,img:d.champId.champImg,name:d.champId.champ})
    //             }
    //         }
    //     }
    //   }
  }
}
