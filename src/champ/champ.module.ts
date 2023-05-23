import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ChampController } from './champ.controller';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { UpdateChampRateEntity } from './entities/update.champ.rate.entity';
import { ChampSkillEntity } from './entities/champSkillInfo.entity';
import { GameInfoEntity } from './entities/game.info.entity';
import { TransferChampData } from './champ.data.transfer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameInfoEntity,
      UpdateChampRateEntity,
      ChampEntity,
      ChampSkillEntity,
      UserEntity,
    ]),
  ],
  controllers: [ChampController],
  providers: [ChampService, ChampRepository, TransferChampData],
  exports: [ChampRepository],
})
export class ChampModule {}
