import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Sanatopia')
    .setDescription('Service for booking Sanatoriums and Hotels')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('/api');

  await app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT = ${process.env.PORT}`);
  });
}
bootstrap();
