import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Sacar cuando este el gateway
  app.enableCors();

  // TODO: Especificar para el caso concreto
  const config = new DocumentBuilder()
    .setTitle('Metricas')
    .setDescription('Documentación de API Metricas')
    .setVersion('1.0')
    .addTag('metrics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
