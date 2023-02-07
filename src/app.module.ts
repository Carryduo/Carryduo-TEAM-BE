import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ChampModule } from './champ/champ.module';
import { SummonerModule } from './summoner/summoner.module';
import { CommentsModule } from './comments/comments.module';
import { CombinationStatModule } from './combination-stat/combination-stat.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { typeOrmOption } from './common/configs/typeorm.config';
import { redisOption } from './common/configs/redis.config';
import { SimulationModule } from './simulation/simulation.module';

@Module({
  imports: [CacheModule.register(redisOption[process.env.NODE_ENV]), ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(typeOrmOption[process.env.NODE_ENV]), AdminModule, UserModule, ChampModule, SummonerModule, CommentsModule, CombinationStatModule, SubscriptionModule, SimulationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
