import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Sanatopia')
    .setDescription('Service for booking Sanatoriums and Hotels')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with the origin(s) of your frontend
    credentials: true, // Enable credentials (cookies, authorization headers)
  });
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT = ${process.env.PORT}`);
  });
}
bootstrap();
