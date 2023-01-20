import { DataSource } from 'typeorm';
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
  entities: ['./src/champ/entities/*.ts', './src/combination-stat/entities/*.ts', './src/summoner/entities/*.ts', './src/user/entities/*.ts', './src/comments/entities/*.ts', './src/simulation/entities/*.ts', './src/subscription/entities/*.ts'],
  synchronize: false, //! set 'false' in production = 동기화 여부, 리셋되는 것이므로 prod 레벨에선 해제
  logging: true,
  timezone: 'local',
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

export default dataSource;
