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
import { UserEntity } from './user/entities/user.entity';
import { ChampEntity } from './champ/entities/champ.entity';
import { ChampSkillInfoEntity } from './champ/entities/champSkillInfo.entity';
import { SummonerEntity } from './summoner/entities/summoner.entity';
import { CommentEntity } from './comments/entities/comments.entity';
import { CombinationStatEntity } from './combination-stat/entities/combination-stat.entity';
import { SubscriptionEntity } from './subscription/entities/subscription.entity';

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
      SummonerEntity,
      CombinationStatEntity,
      CommentEntity,
      SubscriptionEntity,
    ],
    synchronize: false, //! set 'false' in production = 동기화 여부, 리셋되는 것이므로 prod 레벨에선 해제
    autoLoadEntities: true,
    logging: true,
    keepConnectionAlive: true,
    timezone: 'local',
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AdminModule,
    UserModule,
    ChampModule,
    SummonerModule,
    CommentsModule,
    CombinationStatModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
