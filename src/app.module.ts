import { Module } from '@nestjs/common';
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
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { UserEntity } from './user/entities/user.entity';
import { ChampEntity } from './champ/entities/champ.entity';
import { ChampSkillInfoEntity } from './champ/entities/champSkillInfo.entity';
import { SummonerEntity } from './summoner/entities/summoner.entity';
import { CommentEntity } from './comments/entities/comments.entity';
import { CombinationStatEntity } from './combination-stat/entities/combination-stat.entity';
import { SubscriptionEntity } from './subscription/entities/subscription.entity';
import { SummonerHistoryEntity } from './summoner/entities/summoner.history.entity';
import { ChampSpellEntity } from './champ/entities/champ.spell';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    ],
    synchronize: false, //! set 'false' in production = 동기화 여부, 리셋되는 것이므로 prod 레벨에선 해제
    autoLoadEntities: true,
    logging: true,
    keepConnectionAlive: true,
    timezone: 'local',
    charset: 'utf8mb4',
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1,
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
    EventsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
