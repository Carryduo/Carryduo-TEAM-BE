import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChampBanEntity } from '../../champ/entities/champ.ban.entity';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { ChampSkillEntity } from '../../champ/entities/champSkillInfo.entity';
import { GameInfoEntity } from '../../champ/entities/game.info.entity';
import { UpdateChampRateEntity } from '../../champ/entities/update.champ.rate.entity';
import { UpdateChampSpellEntity } from '../../champ/entities/update.champ.spell.entity';
import { CombinationStatEntity } from '../../combination-stat/entities/combination-stat.entity';
import { CommentEntity } from '../../comments/entities/comments.entity';
import { SimulationEntity } from '../../simulation/entities/simulation.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { SummonerEntity } from '../../summoner/entities/summoner.entity';
import { SummonerHistoryEntity } from '../../summoner/entities/summoner.history.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class typeOrmOption {
  static readonly dev: TypeOrmModuleOptions = {
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: process.env.DB_HOST, // process.env.DB_HOST
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      GameInfoEntity,
      UpdateChampRateEntity,
      ChampBanEntity,
      UpdateChampSpellEntity,
      UserEntity,
      ChampEntity,
      ChampSkillEntity,
      SummonerEntity,
      CombinationStatEntity,
      CommentEntity,
      SubscriptionEntity,
      SummonerHistoryEntity,
      SimulationEntity,
    ],
    synchronize: false,
    autoLoadEntities: true,
    logging: false,
    keepConnectionAlive: true,
    timezone: 'local',
    charset: 'utf8mb4',
  };
  static readonly test: TypeOrmModuleOptions = {
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: process.env.DB_HOST, // process.env.DB_HOST
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    entities: [
      GameInfoEntity,
      UpdateChampRateEntity,
      ChampBanEntity,
      UpdateChampSpellEntity,
      UserEntity,
      ChampEntity,
      ChampSkillEntity,
      SummonerEntity,
      CombinationStatEntity,
      CommentEntity,
      SubscriptionEntity,
      SummonerHistoryEntity,
      SimulationEntity,
    ],
    synchronize: false,
    autoLoadEntities: true,
    logging: false,
    keepConnectionAlive: true,
    timezone: 'local',
    charset: 'utf8mb4',
  };

  static readonly local: TypeOrmModuleOptions = {
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: process.env.LOCAL_DB_HOST, // process.env.DB_HOST
    port: Number(process.env.LOCAL_DB_PORT),
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    entities: [
      GameInfoEntity,
      UpdateChampRateEntity,
      ChampBanEntity,
      UpdateChampSpellEntity,
      UserEntity,
      ChampEntity,
      ChampSkillEntity,
      SummonerEntity,
      CombinationStatEntity,
      CommentEntity,
      SubscriptionEntity,
      SummonerHistoryEntity,
      SimulationEntity,
    ],
    synchronize: false,
    autoLoadEntities: true,
    logging: false,
    keepConnectionAlive: true,
    timezone: 'local',
    charset: 'utf8mb4',
  };
}
