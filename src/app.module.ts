import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ChampModule } from './champ/champ.module';
import { SummonerModule } from './summoner/summoner.module';
import { CommentsModule } from './comments/comments.module';
import { CombinationStatModule } from './combination-stat/combination-stat.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserEntity } from './user/entities/user.entity';
import { ChampEntity } from './champ/entities/champ.entity';
import { ChampSkillInfoEntity } from './champ/entities/champSkillInfo.entity';
import { SummonerEntity } from './summoner/entities/summoner.entity';
import { CommentEntity } from './comments/entities/comments.entity';
import { CombinationStatEntity } from './combination-stat/entities/combination-stat.entity';
import { SubscriptionEntity } from './subscription/entities/subscription.entity';
import { SummonerHistoryEntity } from './summoner/entities/summoner.history.entity';
import { ChampSpellEntity } from './champ/entities/champ.spell';
import { SimulationModule } from './simulation/simulation.module';
import { SimulationEntity } from './simulation/entities/simulation.entity';
import * as redisStore from 'cache-manager-redis-store';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get('DB_HOST'), // process.env.DB_HOST
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [
      UserEntity,
      ChampEntity,
      ChampSkillInfoEntity,
      ChampSpellEntity,
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
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: configService.get('REDIS_TTL'),
        no_ready_check: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AdminModule,
    UserModule,
    ChampModule,
    SummonerModule,
    CommentsModule,
    CombinationStatModule,
    SubscriptionModule,
    SimulationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
