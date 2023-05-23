export const champDefaultData = {
  id: '1',
  champNameKo: '애니',
  champNameEn: 'Annie',
  champImg:
    'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Annie_0.jpg',
};

export const skillInfo = [
  {
    skillId: 'q',
    skillName: '붕괴',
    skillDesc:
      '애니가 마나로 가득 찬 화염구를 던져 피해를 입히고 결정타를 냈을 때 사용한 마나를 되돌려 받습니다.',
    skillToolTip:
      '애니가 화염구를 던져 ?의 마법 피해를 입힙니다. 대상이 사망하면 소모한 마나를 돌려받고 재사용 대기시간이 % 감소합니다.',
    skillImg:
      'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/AnnieQ.png',
  },
  {
    skillId: 'w',
    skillName: '소각',
    skillDesc:
      '애니가 원뿔 형태의 화염을 내뿜어 해당 지역에 있는 모든 적에게 피해를 입힙니다.',
    skillToolTip: '애니가 화염파를 발사하여 ?의 마법 피해를 입힙니다.',
    skillImg:
      'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/AnnieW.png',
  },
  {
    skillId: 'e',
    skillName: '용암 방패',
    skillDesc:
      '애니나 아군에게 보호막을 부여하고 이동 속도가 증가하며, 기본 공격을 가하는 적에게 피해를 입힙니다.',
    skillToolTip:
      '애니가 자신이나 아군에게 ?초 동안 ?의 피해를 흡수하는 보호막을 부여합니다. 보호막으로 인해 이동 속도가 ? 증가한 뒤 ?초에 걸쳐 원래대로 돌아옵니다. 보호막이 지속되는 동안 공격한 적은 ?의 마법 피해를 입습니다.  소환된 티버는 항상 용암 방패의 효과를 받습니다.',
    skillImg:
      'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/AnnieE.png',
  },
  {
    skillId: 'r',
    skillName: '소환: 티버',
    skillDesc:
      '애니가 자신의 곰 티버를 되살려 지정 구역에 있는 유닛에게 피해를 입힙니다. 티버는 주변의 적을 공격하거나 불태울 수도 있습니다.',
    skillToolTip:
      '애니가 티버를 소환해 ?의 마법 피해를 입힙니다. 티버는 ?초간 주변 적을 불태워 초당 ?의 마법 피해를 입히고 적을 공격해 ?의  마법 피해를 입힙니다. 애니는 이 스킬을 재사용해 티버를 조종할 수 있습니다.  애니가 적 챔피언을 기절시키거나 사망하면 소환된 티버가 분노합 니다. 티버는 분노 시 공격 속도가 %, 이동 속도가 % 증가합니다. 이 효과는 초에 걸쳐 원래대로 돌아옵니다.',
    skillImg:
      'https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/AnnieR.png',
  },
  {
    skillId: 'passive',
    skillName: '방화광',
    skillDesc:
      '애니가 스킬을 번 사용한 후 다음 공격 스킬에 맞은 적은 기절합니다.',
    skillToolTip: null,
    skillImg:
      'http://ddragon.leagueoflegends.com/cdn/12.17.1/img/passive/Annie_Passive.png',
  },
];

export const TOP = [
  {
    winRate: '30.8238',
    pickRate: '0.5701',
    spell1: 14,
    spell2: 4,
    version: '13.1.',
  },
];
export const JUNGLE = [
  {
    winRate: '50.8238',
    pickRate: '30.5701',
    spell1: 14,
    spell2: 4,
    version: '13.1.',
  },
];
export const MIDDLE = [
  {
    winRate: '20.8238',
    pickRate: '5.5701',
    spell1: 14,
    spell2: 4,
    version: '13.1.',
  },
];
export const UTILITY = [
  {
    winRate: '10.8238',
    pickRate: '10.5701',
    spell1: 14,
    spell2: 4,
    version: '13.1.',
  },
];
export const BOTTOM = [
  {
    winRate: '5.8238',
    pickRate: '1.5701',
    spell1: 14,
    spell2: 4,
    version: '13.1.',
  },
];
export const DEFAULT = [];
