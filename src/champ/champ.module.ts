import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampController } from './champ.controller';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChampEntity,
      ChampSkillInfoEntity,
      ChampSpellEntity,
      UserEntity,
    ]),
    HttpModule,
  ],
  controllers: [ChampController],
  providers: [ChampService, ChampRepository],
})
export class ChampModule {}
