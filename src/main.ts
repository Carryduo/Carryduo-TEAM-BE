import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  await app.listen(port);
  process.on("SIGINT", () => {
    app.close(() => {
        console.log("server closed")
        process.exit(0)
    })
}

bootstrap();
