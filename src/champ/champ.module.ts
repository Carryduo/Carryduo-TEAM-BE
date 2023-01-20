import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampController } from './champ.controller';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { ChampRateEntity } from './entities/champ.rate.entity';
import { UpdateChampRateEntity } from './entities/update.champ.rate.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';
import { GameInfoEntity } from './entities/game.info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameInfoEntity, UpdateChampRateEntity, ChampEntity, ChampRateEntity, ChampSkillInfoEntity, ChampSpellEntity, UserEntity])],
  controllers: [ChampController],
  providers: [ChampService, ChampRepository],
  exports: [ChampRepository],
})
export class ChampModule {}
