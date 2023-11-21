import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
