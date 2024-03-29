import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  //http reqeust global prefix setting and exclude path: /
  app.setGlobalPrefix(process.env.API_VERSION, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  //global pipes validator setting
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setting
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('MomIsPappy API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
        'accessToken',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  } else {
  }
  // Prisma settting
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  //CORS
  const whitelist = process.env.CORS_ORIGIN || [];
  let splitWhitelist: string[];
  if (typeof whitelist === 'string') {
    splitWhitelist = whitelist.split(',');
  }
  console.log(splitWhitelist);
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || splitWhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  await app.listen(PORT);
  console.log(`server running ${process.env.NODE_ENV}:${PORT}`);
}
bootstrap();
