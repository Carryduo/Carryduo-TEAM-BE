import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000
  await app.listen(port, () => {
    process.send('ready')
  console.log(`application is listening on port ${port}...`)
  });
  process.on('SIGINT', function () {
    app.close(function () {
    console.log('server closed')
    process.exit(0)
    })
}

bootstrap();
