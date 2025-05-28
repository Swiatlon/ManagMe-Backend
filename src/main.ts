import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${String(port)}`);
}
bootstrap();
