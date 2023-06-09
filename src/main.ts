require('newrelic');
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
    .addTag('Metrics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options = { jsonDocumentUrl: 'openapi.json' };
  SwaggerModule.setup('docs', app, document, options);

  await app.listen(3000);
}
bootstrap();
