import { ChampEntity } from './src/champ/entities/champ.entity';
import { ChampSkillInfoEntity } from './src/champ/entities/champSkillInfo.entity';
import { CombinationStatEntity } from 'src/combination-stat/entities/combination-stat.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { SummonerHistoryEntity } from 'src/summoner/entities/summoner.history.entity';
import { ChampRateEntity } from 'src/champ/entities/champ.rate.entity';
import { ChampSpellEntity } from 'src/champ/entities/champ.spell';
import { SimulationEntity } from 'src/simulation/entities/simulation.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'), // process.env.DB_HOST
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [UserEntity, ChampEntity, ChampRateEntity, ChampSkillInfoEntity, ChampSpellEntity, SummonerEntity, CombinationStatEntity, CommentEntity, SubscriptionEntity, SummonerHistoryEntity, SimulationEntity],

  synchronize: false, //! set 'false' in production = 동기화 여부, 리셋되는 것이므로 prod 레벨에선 해제
  logging: true,
  timezone: 'local',
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
