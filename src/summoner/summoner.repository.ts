import { InjectRepository } from '@nestjs/typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { Repository } from 'typeorm';
import { SummonerInfoDTO } from './dto/summoner.dto';
import { SummonerEntity } from './entities/summoner.entity';

export class SummonerRepository {
  constructor(
    @InjectRepository(SummonerEntity)
    private readonly summonerRepository: Repository<SummonerEntity>,
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
  ) {}

  async findSummoner(summonerName: string) {
    const summoner = this.summonerRepository.findOne({
      where: {
        summonerName,
      },
    });
    // const summoner = this.summonerRepository
    //   .createQueryBuilder('summoner')
    //   .leftJoinAndSelect(
    //     ChampEntity,
    //     'champ1',
    //     'champ1.id = summoner.mostChamp1',
    //   )
    //   .leftJoinAndSelect(
    //     ChampEntity,
    //     'champ2',
    //     'champ2.id = summoner.mostChamp2',
    //   )
    //   .leftJoinAndSelect(
    //     ChampEntity,
    //     'champ3',
    //     'champ3.id = summoner.mostChamp3',
    //   )
    //   .where('summoner.mostChamp1 =:mostChamp1', {
    //     mostChamp1: mostChampList[0],
    //   })
    //   .andWhere('summoner.mostChamp2 =:mostChamp2', {
    //     mostChamp2: mostChampList[1],
    //   })
    //   .andWhere('summoner.mostChamp3 =:mostChamp3', {
    //     mostChamp3: mostChampList[2],
    //   })
    //   .getRawOne();
    return summoner;
  }

  async insertSummoner(summonerInfo: SummonerInfoDTO) {
    return this.summonerRepository
      .createQueryBuilder()
      .insert()
      .into(SummonerEntity)
      .values(summonerInfo)
      .execute();
  }

  async updateSummoner(summonerInfo: SummonerInfoDTO) {
    return this.summonerRepository
      .createQueryBuilder()
      .update(SummonerEntity)
      .set(summonerInfo)
      .where('summonerName=:summonerName', {
        summonerName: summonerInfo.summonerName,
      })
      .execute();
  }

  async summonerInfo(summonerName: string) {}
}
